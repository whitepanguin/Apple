from fastapi import APIRouter, Query, HTTPException
from sentence_transformers import SentenceTransformer, CrossEncoder
from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch
from config import *

router = APIRouter()

# 모델 로딩
# bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2") # 벡터 384
bi_encoder = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))

COLLECTION = "apple_collection"
ES_INDEX = "apple_index"

@router.get("/search")
def search(q: str = Query(..., description="검색어")):
    try:
        vector = bi_encoder.encode(q).tolist()
        hits = qdrant.search(
            collection_name=COLLECTION,
            query_vector=vector,
            limit=20
        )
    except Exception as e:
        print("❌ Qdrant 검색 실패:", e)
        raise HTTPException(status_code=500, detail=str(e))

    candidates = []
    for hit in hits:
        payload = hit.payload or {}

        candidates.append({
            "id": hit.id,  # ← Qdrant UUID 사용
            "title": payload.get("tittle", ""),
            "text": payload.get("text", ""),
            "img": payload.get("img", ""),
            "price": payload.get("price", 0),
            "category": payload.get("category", ""),
            "userid": payload.get("userid", ""),
            "createdAt": payload.get("createdAt", ""),
            "updatedAt": payload.get("updatedAt", "")
        })

    # 3. CrossEncoder로 재정렬 점수 계산
    pairs = [(q, doc["text"]) for doc in candidates]
    scores = cross_encoder.predict(pairs)

    for i, doc in enumerate(candidates):
        doc["ai_score"] = float(scores[i])

    # 4. 점수 기준 정렬
    candidates.sort(key=lambda x: x["ai_score"], reverse=True)

    return {
        "query": q,
        "results": candidates[:10]
    }
