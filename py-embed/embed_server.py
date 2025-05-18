from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # CORS 허용

from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn
from search_router import router as search_router

app = FastAPI()
app.include_router(search_router)

# CORS 허용 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # 프론트 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 한국어 문장 임베딩 모델 로딩 (최초 1회)
model = SentenceTransformer("jhgan/ko-sbert-nli")

# 요청 바디 정의
class EmbedRequest(BaseModel):
    text: str

# POST /embed 엔드포인트
@app.post("/embed")
async def embed(request: EmbedRequest):
    embedding = model.encode([request.text])[0]  # 단일 문장만 처리
    return {"vector": embedding.tolist()}        # 리스트 형태로 반환

@app.get("/")
def read_root():
    return {"message": "서버 정상 작동 중 ✅"}

# 실행
if __name__ == "__main__":
    uvicorn.run("embed_server:app", host="0.0.0.0", port=8000, reload=True)
