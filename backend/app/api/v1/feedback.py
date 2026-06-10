from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import hashlib

from app.models.schemas import FeedbackRequest, FeedbackResponse
from app.db.postgres import get_db, CallFeedback, CallerNumber

logger = logging.getLogger("echoshield.api.feedback")

router = APIRouter(prefix="/calls", tags=["Feedback"])


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackRequest,
    db: Session = Depends(get_db)
):
    """
    POST /api/v1/calls/feedback
    Human feedback loop — update model training data and reputation DB.
    """
    try:
        # Store feedback in database for retraining
        call_feedback = CallFeedback(
            call_id=feedback.call_id,
            phone_number=feedback.phone_number,
            predicted_risk_score=feedback.predicted_risk_score,
            predicted_scam_label=feedback.predicted_scam_label,
            user_confirmed_scam="true" if feedback.was_scam else "false",
            user_notes=feedback.user_notes,
            transcript=None  # Would store transcript in production
        )
        db.add(call_feedback)

        # Update caller reputation if phone number provided
        if feedback.phone_number:
            caller = db.query(CallerNumber).filter(
                CallerNumber.phone_number == feedback.phone_number
            ).first()

            if caller:
                # Increase report count and decrease reputation for confirmed scams
                caller.report_count += 1
                new_rep = max(0.0, caller.reputation_score - 0.1) if feedback.was_scam else min(1.0, caller.reputation_score + 0.05)
                caller.reputation_score = new_rep

                if feedback.was_scam and feedback.predicted_scam_label:
                    dist = caller.scam_type_distribution or {}
                    dist[feedback.predicted_scam_label] = dist.get(feedback.predicted_scam_label, 0) + 1
                    caller.scam_type_distribution = dist
            else:
                # New number
                caller = CallerNumber(
                    phone_number=feedback.phone_number,
                    reputation_score=0.1 if feedback.was_scam else 0.9,
                    report_count=1 if feedback.was_scam else 0
                )
                db.add(caller)

            db.commit()

            # Update Redis cache
            from app.db import redis_client
            await redis_client.set_caller_reputation(
                feedback.phone_number,
                caller.reputation_score,
                caller.report_count,
                caller.last_scam_label,
                ttl_hours=168  # 1 week for confirmed scammers
            )

        logger.info(f"Feedback received for call {feedback.call_id}: was_scam={feedback.was_scam}")

        return FeedbackResponse(
            success=True,
            message="Feedback recorded successfully"
        )

    except Exception as e:
        logger.error(f"Feedback submission failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))