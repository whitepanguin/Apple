import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
# from elasticsearch import Elasticsearch

load_dotenv()

# Qdrant 연결
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# # Elasticsearch 연결
# es = Elasticsearch(
#     os.getenv("ES_URL"),
#     basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
# )

# 설정값. 저장 db 이름
QDRANT_COLLECTION = "vector_collection"
# ES_INDEX = "apple_index"
VECTOR_SIZE = 384

# Qdrant 컬렉션 생성 (존재하지 않을 때만)
collections = qdrant.get_collections().collections
if QDRANT_COLLECTION not in [c.name for c in collections]:
    print(f"📦 Qdrant 컬렉션 '{QDRANT_COLLECTION}' 생성 중...")
    qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config={"size": VECTOR_SIZE, "distance": "Cosine"}
    )
    print("✅ Qdrant 컬렉션 생성 완료!")
else:
    print(f"Qdrant 컬렉션 '{QDRANT_COLLECTION}' 이미 존재함.")

# # Elasticsearch 인덱스 생성 (존재하지 않을 때만)
# if not es.indices.exists(index=ES_INDEX):
#     print(f"📦 Elasticsearch 인덱스 '{ES_INDEX}' 생성 중...")
#     es.indices.create(index=ES_INDEX)
#     print("✅ Elasticsearch 인덱스 생성 완료!")
# else:
#     print(f"Elasticsearch 인덱스 '{ES_INDEX}' 이미 존재함.")
