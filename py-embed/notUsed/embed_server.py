from fastapi import APIRouter, Body
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

router = APIRouter() # 라우터만 선언

# 임베딩 모델
model = SentenceTransformer("jhgan/ko-sbert-nli")

# 요청 바디 타입
class EmbedRequest(BaseModel):
    text: str

# POST /embed 엔드포인트
@router.post("/embed")
async def embed(request: EmbedRequest):
    embedding = model.encode([request.text])[0]  # 단일 문장만 처리
    return {"vector": embedding.tolist()}        # 리스트 형태로 반환