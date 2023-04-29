from flask import Flask, request, jsonify
from flask_cors import CORS
from elasticsearch import Elasticsearch

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

app = Flask(__name__)
CORS(app)

es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])
index_name = "news_articles"

# Update the existing search_articles function
def search_articles(es_instance, index_name, query):
    search_body = {
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title", "text"]
            }
        }
    }
    response = es_instance.search(index=index_name, body=search_body)
    return response["hits"]["hits"]

@app.route('/add-article', methods=['POST'])
def add_article():
    news_articles = request.get_json()

    es.index(index=index_name, body=news_articles)

    return jsonify({"result": "success"})

# Add this function after the add_article function
@app.route('/search-articles', methods=['POST'])
def search_articles_route():
    search_query = request.get_json()["query"]
    search_results = search_articles(es, index_name, search_query)
    return jsonify({"articles": [{"_id": result["_id"], **result["_source"]} for result in search_results]})

@app.route('/remove-articles', methods=['POST'])
def remove_articles():
    article_ids = request.get_json()["articleIds"]
    for article_id in article_ids:
        es.delete(index=index_name, id=article_id)
    return jsonify({"result": "success"})

@app.route('/retrieve-everything', methods=['GET'])
def retrieve_everything():
    query = {"query": {"match_all": {}}}
    result = es.search(index=index_name, body=query)
    articles = [{"_id": hit["_id"], **hit["_source"]} for hit in result["hits"]["hits"]]
    return jsonify({"articles": articles})

if __name__ == '__main__':
    app.run(port=5000)