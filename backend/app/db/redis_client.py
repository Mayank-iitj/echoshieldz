import redis.asyncio as redis
import json
from typing import Optional
from app.core.config import get_settings

settings = get_settings()

_redis_client: Optional[redis.Redis] = None


async def init_redis() -> redis.Redis:
    """Initialize Redis connection."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis_client


async def get_redis() -> redis.Redis:
    """Get Redis client."""
    global _redis_client
    if _redis_client is None:
        await init_redis()
    return _redis_client


# Caller reputation operations
async def get_caller_reputation(phone_number: str) -> dict:
    """Get caller reputation from Redis cache."""
    redis = await get_redis()
    key = f"rep:{phone_number}"
    data = await redis.get(key)
    if data:
        return json.loads(data)
    return {"score": 0.5, "reported_count": 0, "top_scam_type": None}


async def set_caller_reputation(phone_number: str, score: float, reported_count: int, scam_type: str = None, ttl_hours: int = 24):
    """Set caller reputation in Redis cache."""
    redis = await get_redis()
    key = f"rep:{phone_number}"
    data = json.dumps({
        "score": score,
        "reported_count": reported_count,
        "top_scam_type": scam_type
    })
    await redis.setex(key, ttl_hours * 3600, data)


# Active call session operations
async def get_call_session(call_id: str) -> Optional[dict]:
    """Get active call session state."""
    redis = await get_redis()
    key = f"call:{call_id}"
    data = await redis.get(key)
    if data:
        return json.loads(data)
    return None


async def set_call_session(call_id: str, risk_score: float, transcript: str, chunk_count: int, ttl_seconds: int = 3600):
    """Update active call session state."""
    redis = await get_redis()
    key = f"call:{call_id}"
    data = json.dumps({
        "risk_score": risk_score,
        "transcript": transcript,
        "chunk_count": chunk_count
    })
    await redis.setex(key, ttl_seconds, data)


async def delete_call_session(call_id: str):
    """Delete call session."""
    redis = await get_redis()
    key = f"call:{call_id}"
    await redis.delete(key)


# Rate limiting
async def check_rate_limit(device_id: str, max_requests: int = 100, window_seconds: int = 60) -> bool:
    """Check if device has exceeded rate limit."""
    redis = await get_redis()
    key = f"ratelimit:{device_id}"
    current = await redis.get(key)
    if current and int(current) >= max_requests:
        return False
    pipe = redis.pipeline()
    pipe.incr(key)
    pipe.expire(key, window_seconds)
    await pipe.execute()
    return True