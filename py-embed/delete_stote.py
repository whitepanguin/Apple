from elasticsearch import Elasticsearch
from qdrant_client import QdrantClient
from config import ES_URL, ES_USERNAME, ES_PASSWORD
from config import QDRANT_URL, QDRANT_API_KEY

es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))
qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)


ES_INDEX = "apple_index"
COLLECTION = "apple_collection"

# 인덱스 삭제
if es.indices.exists(index=ES_INDEX):
    es.indices.delete(index=ES_INDEX)
    print(f"✅ Elasticsearch 인덱스 '{ES_INDEX}' 삭제 완료")
else:
    print(f"ℹ️ 인덱스 '{ES_INDEX}'가 존재하지 않습니다")


# 컬렉션 삭제
try:
    qdrant.delete_collection(collection_name=COLLECTION)
    print(f"✅ Qdrant 컬렉션 '{COLLECTION}' 삭제 완료")
except Exception as e:
    print(f"❌ Qdrant 컬렉션 삭제 실패: {e}")
