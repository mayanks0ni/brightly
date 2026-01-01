from fastapi import Header, HTTPException
from app.core.firebase import auth_client

async def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        return auth_client.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")