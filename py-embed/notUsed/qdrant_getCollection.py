from qdrant_client import QdrantClient
from config import QDRANT_URL, QDRANT_API_KEY

# client = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)
qdrant = QdrantClient(QDRANT_URL, api_key=QDRANT_API_KEY)

collection_name = "image_collection"
collection_info = qdrant.get_collection(collection_name=collection_name)

# print("📦 컬렉션 정보:")
# print(collection_info)

res = qdrant.scroll(collection_name="image_collection", limit=1, with_vectors=True)
print(res)


# collections = client.get_collections()
# print("📦 현재 Qdrant 컬렉션 목록:")
# for collection in collections.collections:
#     print("-", collection.name)
