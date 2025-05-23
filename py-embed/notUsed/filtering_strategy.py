from fastapi import APIRouter, Query, HTTPException
from elasticsearch import Elasticsearch
from config import *
import time

router = APIRouter()
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))

@router.get("/search")
def search(
    q: str = Query(..., description="검색어"),
    type: str = Query("text", description="검색 타입: text 또는 image")
):
    start = time.time()

    if type != "text":
        raise HTTPException(status_code=400, detail="이미지 검색은 여기서 처리하지 않음")

    try:
        response = es.search(
            index="posts_index",  # ✅ 인덱스명 일치
            body={
                "query": {
                    "multi_match": {
                        "query": q,
                        "fields": ["tittle", "text", "category"],
                        "fuzziness": "AUTO"  # 오타 허용
                    }
                },
                "size": 10
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    hits = response["hits"]["hits"]
    results = [
        {
            "id": hit["_id"],
            "mongoId": hit["_source"].get("mongoId", ""),
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

    print(f"\n🔍 검색어: {q}")
    for r in results:
        print(f"- {r['title'][:20]}... → score: {r['score']:.3f}")
    print(f"⏱️  검색 소요 시간: {time.time() - start:.2f}s\n")

    return {
        "query": q,
        "results": results
    }
