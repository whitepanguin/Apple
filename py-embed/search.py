from fastapi import APIRouter, Query, HTTPException
from elasticsearch import Elasticsearch
from config import *
import time

router = APIRouter()
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))


@router.get("/search")
def search(
    q: str = Query(..., description="검색어"),
    type: str = Query("text", description="검색 타입: text 또는 image"),
    selectedSearchType: str = Query("used", description="검색 대상: used 또는 realestate")
):
    start = time.time()

    if type != "text":
        raise HTTPException(status_code=400, detail="이미지 검색은 여기서 처리하지 않음")

    # 부동산 검색 필드 구성
    if selectedSearchType == "realestate":
        index_name = "realestate_index"
        fields = [
            "price^2",
            "building_usage^2",
            "sale",
            "deposit",
            "monthly_rent"
        ]
        use_fuzziness = False # 부동산 데이터는 오타 허용 안함

    # 포스트 검색 필드 구성
    elif selectedSearchType == "used":
        index_name = "posts_index"
        fields = ["tittle", "text", "category"]
        use_fuzziness = True # 포스트 데이터는 오타 허용
    else:
        raise HTTPException(status_code=400, detail="잘못된 selectedSearchType입니다.")

    # ✅ Elasticsearch 쿼리 구성
    match_query = {
        "query": q,
        "fields": fields,
    }

    if use_fuzziness:
        match_query["fuzziness"] = "AUTO"

    try:
        response = es.search(
            index=index_name,
            body={
                "query": {
                    "multi_match": match_query
                },
                "size": 10
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    hits = response["hits"]["hits"]

    # ✅ 결과 정리
    results = []
    for hit in hits:
        source = hit["_source"]
        base = {
            "id": hit["_id"],
            "mongoId": source.get("mongoId", ""),
            "img": source.get("img", ""),
            "score": hit["_score"]
        }

        if selectedSearchType == "realestate":
            base.update({
                "title": source.get("building_usage", ""),
                "price": source.get("sale", ""),
                "category": source.get("price", "")
            })
        else:  # used
            base.update({
                "title": source.get("tittle", ""),
                "text": source.get("text", ""),
                "price": source.get("price", 0),
                "category": source.get("category", ""),
                "userid": source.get("userid", ""),
                "createdAt": source.get("createdAt", ""),
                "updatedAt": source.get("updatedAt", "")
            })

        results.append(base)

    print(f"\n🔍 검색어: {q} | 유형: {selectedSearchType}")
    for r in results:
        print(f"- {r['title'][:20]}... → score: {r['score']:.3f}")
    print(f"⏱️  검색 소요 시간: {time.time() - start:.2f}s\n")

    return {
        "query": q,
        "type": selectedSearchType,
        "results": results
    }
