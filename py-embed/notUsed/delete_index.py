from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

es = Elasticsearch(os.getenv("ES_URL"), basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD")))
index_name = "posts"

if es.indices.exists(index=index_name):
    es.indices.delete(index=index_name)
    print(f"✅ 인덱스 '{index_name}' 삭제 완료")
else:
    print(f"❌ 인덱스 '{index_name}' 가 존재하지 않습니다.")
