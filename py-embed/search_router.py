from fastapi import APIRouter, Query, HTTPException
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch
from config import *
import time

router = APIRouter()

# 벡터 인코더 (이미지/텍스트 벡터화용)
bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# 클라이언트 연결
qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))


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

    results = [
        {
            "id": hit.id,
            "title": hit.payload.get("tittle", ""),
            "text": hit.payload.get("text", ""),
            "img": hit.payload.get("img", ""),
            "price": hit.payload.get("price", 0),
            "category": hit.payload.get("category", ""),
            "userid": hit.payload.get("userid", ""),
            "createdAt": hit.payload.get("createdAt", ""),
            "updatedAt": hit.payload.get("updatedAt", ""),
            "score": hit.score
        }
        for hit in hits
    ]

    return {
        "query": q,
        "results": results[:10]
    }


# 텍스트 검색 (Elasticsearch only)
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
            "size": 50
        }

        response = es.search(index="text_index", body=es_query)
        hits = response["hits"]["hits"]
    except Exception as e:
        print("❌ Elasticsearch 검색 실패:", e)
        raise HTTPException(status_code=500, detail=str(e))

    results = [
        {
            "id": hit["_id"],
            "title": hit["_source"].get("tittle", ""),
            "text": hit["_source"].get("text", ""),
            "img": hit["_source"].get("img", ""),
            "price": hit["_source"].get("price", 0),
            "category": hit["_source"].get("category", ""),
            "userid": hit["_source"].get("userid", ""),
            "createdAt": hit["_source"].get("createdAt", ""),
            "updatedAt": hit["_source"].get("updatedAt", ""),
            "score": hit["_score"]
        }
        for hit in hits
    ]

    print("🔹 Elasticsearch 검색 시간:", time.time() - start)

    return {
        "query": q,
        "results": results[:10]
    }
