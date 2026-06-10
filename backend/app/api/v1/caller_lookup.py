from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
import logging

from app.models.schemas import ReputationResponse
from app.db.postgres import get_db, CallerNumber
from app.db import redis_client

logger = logging.getLogger("echoshield.api.caller_lookup")

router = APIRouter(prefix="/calls", tags=["Caller Reputation"])


@router.get("/reputation/{phone_number}", response_model=ReputationResponse)
async def get_caller_reputation(phone_number: str, request: Request, db: Session = Depends(get_db)):
    """
    GET /api/v1/calls/reputation/{phone_number}
    Fast lookup before call connects. Returns reputation summary.
    """
    # Try Redis first (hot path)
    try:
        redis_result = await redis_client.get_caller_reputation(phone_number)
        if redis_result.get("score") is not None:
            return ReputationResponse(
                phone_number=phone_number,
                reputation_score=redis_result["score"],
                reported_count=redis_result.get("reported_count", 0),
                top_scam_type=redis_result.get("top_scam_type")
            )
    except Exception as e:
        logger.warning(f"Redis lookup failed: {e}")

    # Fallback to PostgreSQL (cold path)
    try:
        caller = db.query(CallerNumber).filter(CallerNumber.phone_number == phone_number).first()
        if caller:
            return ReputationResponse(
                phone_number=phone_number,
                reputation_score=caller.reputation_score,
                reported_count=caller.report_count,
                top_scam_type=caller.last_scam_label
            )
    except Exception as e:
        logger.warning(f"DB lookup failed: {e}")

    # Default: unknown number
    return ReputationResponse(
        phone_number=phone_number,
        reputation_score=0.5,
        reported_count=0,
        top_scam_type=None
    )


@router.post("/reputation/{phone_number}")
async def update_caller_reputation(
    phone_number: str,
    reputation_score: float,
    scam_type: str = None,
    db: Session = Depends(get_db)
):
    """
    POST /api/v1/calls/reputation/{phone_number}
    Update caller reputation (after feedback or analysis).
    """
    try:
        caller = db.query(CallerNumber).filter(CallerNumber.phone_number == phone_number).first()

        if caller:
            caller.reputation_score = reputation_score
            if scam_type:
                # Update scam type distribution
                dist = caller.scam_type_distribution or {}
                dist[scam_type] = dist.get(scam_type, 0) + 1
                caller.scam_type_distribution = dist
                caller.last_scam_label = scam_type
            caller.report_count += 1
        else:
            caller = CallerNumber(
                phone_number=phone_number,
                reputation_score=reputation_score,
                report_count=1,
                scam_type_distribution={scam_type: 1} if scam_type else {},
                last_scam_label=scam_type
            )
            db.add(caller)

        db.commit()

        # Update Redis cache
        await redis_client.set_caller_reputation(
            phone_number,
            reputation_score,
            caller.report_count,
            scam_type,
            ttl_hours=24
        )

        return {"success": True, "phone_number": phone_number}
    except Exception as e:
        logger.error(f"Update reputation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))