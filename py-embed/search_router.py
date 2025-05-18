from fastapi import APIRouter, Query

from sentence_transformers import SentenceTransformer, CrossEncoder

from qdrant_client import QdrantClient
from qdrant_client.http.models import SearchRequest
from elasticsearch import Elasticsearch

from config import *

router = APIRouter()

# 모델 로딩
bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")  # 후보 추출용
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")       # rerank용

qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))

COLLECTION = "apple_collection"
ES_INDEX = "apple_index"


# 테스트용
@router.get("/search")
def search(q: str = Query(...)):
    return {"query": q, "message": "검색 잘 들어왔어요"}


# @router.get("/search")
# def search(q: str = Query(..., description="검색어")):
#     # 1. 벡터 생성 (Bi-encoder)
#     vector = bi_encoder.encode(q).tolist()

#     # 2. Qdrant에서 후보 수집 (상위 20개)
#     hits = qdrant.search(
#         collection_name=COLLECTION,
#         query_vector=vector,
#         limit=20
#     )

#     candidates = []
#     for hit in hits:
#         doc_id = hit.payload.get("elasticId") or hit.id
#         source = {
#             "title": hit.payload.get("tittle", ""),
#             "text": hit.payload.get("text", ""),
#             "category": hit.payload.get("category", ""),
#             "price": hit.payload.get("price", 0),
#             "userid": hit.payload.get("userid", ""),
#         }

#         candidates.append({
#             "id": doc_id,
#             "text": source["text"],
#             "title": source["title"],
#             "meta": source
#         })

#     # 3. Cross-Encoder로 점수 계산
#     pairs = [(q, doc["text"]) for doc in candidates]
#     scores = cross_encoder.predict(pairs)

#     for i, doc in enumerate(candidates):
#         doc["ai_score"] = float(scores[i])

#     # 4. 최종 정렬
#     candidates.sort(key=lambda x: x["ai_score"], reverse=True)

#     return {
#         "query": q,
#         "results": candidates[:10]  # top 10만 반환
#     }
