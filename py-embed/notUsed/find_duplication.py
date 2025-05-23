from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

es = Elasticsearch(os.getenv("ES_URL"), basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD")))
index_name = "korean_market_index"

query = {
    "size": 0,
    "aggs": {
        "duplicate_titles": {
            "terms": {
                "field": "tittle.keyword",
                "min_doc_count": 2,
                "size": 1000
            }
        }
    }
}

res = es.search(index=index_name, body=query)

print("✅ 중복된 제목 목록:")
for bucket in res["aggregations"]["duplicate_titles"]["buckets"]:
    print(f"- {bucket['key']} (count: {bucket['doc_count']})")
