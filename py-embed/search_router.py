from fastapi import APIRouter, Query, HTTPException
from sentence_transformers import SentenceTransformer, CrossEncoder
from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch
from config import *
import time

router = APIRouter()

bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")  # 384차원
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# 클라이언트 연결
qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))

# 검색 API
@router.get("/search")
def search(q: str = Query(..., description="검색어"), type: str = Query("text", description="검색 타입: text 또는 image")):
    start = time.time()

    if type == "image":
        return search_by_image(q, start)
    else:
        return search_by_text(q, start)


# 이미지 검색 (Qdrant)
def search_by_image(q: str, start: float):
    try:
        vector = bi_encoder.encode(q).tolist()
        hits = qdrant.search(
            collection_name="image_collection",
            query_vector=vector,
            limit=20
        )
        print("🔹 Qdrant 이미지 검색 시간:", time.time() - start)
    except Exception as e:
        print("❌ Qdrant 검색 실패:", e)
        raise HTTPException(status_code=500, detail=str(e))

    candidates = []
    for hit in hits:
        payload = hit.payload or {}
        candidates.append({
            "id": hit.id,
            "title": payload.get("tittle", ""),
            "text": payload.get("text", ""),
            "img": payload.get("img", ""),
            "price": payload.get("price", 0),
            "category": payload.get("category", ""),
            "userid": payload.get("userid", ""),
            "createdAt": payload.get("createdAt", ""),
            "updatedAt": payload.get("updatedAt", ""),
            "score": hit.score
        })

    return {
        "query": q,
        "results": candidates[:10]
    }


# 텍스트 검색 (Elasticsearch + CrossEncoder 재정렬)
def search_by_text(q: str, start: float):
    try:
        es_query = {
            "query": {
                "multi_match": {
                    "query": q,
                    "fields": ["tittle", "text", "category"],
                    "fuzziness": "AUTO"
                }
            },
            "size": 20
        }

        response = es.search(index="text_index", body=es_query)
        hits = response["hits"]["hits"]
    except Exception as e:
        print("❌ Elasticsearch 검색 실패:", e)
        raise HTTPException(status_code=500, detail=str(e))

    candidates = []
    for hit in hits:
        source = hit["_source"]
        candidates.append({
            "id": hit["_id"],
            "title": source.get("tittle", ""),
            "text": source.get("text", ""),
            "img": source.get("img", ""),
            "price": source.get("price", 0),
            "category": source.get("category", ""),
            "userid": source.get("userid", ""),
            "createdAt": source.get("createdAt", ""),
            "updatedAt": source.get("updatedAt", ""),
            "es_score": hit["_score"]
        })

    # CrossEncoder로 재정렬
    if not candidates:
        return {"query": q, "results": [], "message": "No results found in Elasticsearch."}

    pairs = [(q, doc["text"]) for doc in candidates]
    scores = cross_encoder.predict(pairs)

    for i, doc in enumerate(candidates):
        doc["ai_score"] = float(scores[i])

    candidates.sort(key=lambda x: x["ai_score"], reverse=True)
    print("🔹 CrossEncoder 리랭크 포함 총 검색 시간:", time.time() - start)

    return {
        "query": q,
        "results": candidates[:10]
    }
