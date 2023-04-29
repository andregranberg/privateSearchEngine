import json
from elasticsearch import Elasticsearch
import pandas as pd

def delete_index_if_exists(es_instance, index_name):
    if es_instance.indices.exists(index=index_name):
        es_instance.indices.delete(index=index_name)

def create_index(es_instance, index_name):
    request_body = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "properties": {
                "title": {
                    "type": "text"
                },
                "text": {
                    "type": "text"
                }
            }
        }
    }
    es_instance.indices.create(index=index_name, body=request_body)

def index_articles(es_instance, index_name, articles):
    for article in articles:
        es_instance.index(index=index_name, body=article)

if __name__ == "__main__":
    es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])
    
    # Replace with your news articles data
    news_articles = [
        {"title": "Article 1", "text": "This is the text for article 1."},
        {"title": "Article 2", "text": "This is the text for article 2."}
    ]
    
    index_name = "news_articles"
    
    # Delete the index if it exists
    delete_index_if_exists(es, index_name)
    
    # Create the index
    create_index(es, index_name)
    
    # Index the articles
    index_articles(es, index_name, news_articles)