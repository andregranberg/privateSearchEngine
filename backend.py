from flask import Flask, request, jsonify
from flask_cors import CORS
from elasticsearch import Elasticsearch

app = Flask(__name__)
CORS(app)

es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])
index_name = "news_articles"

@app.route('/add-article', methods=['POST'])
def add_article():
    news_articles = request.get_json()

    es.index(index=index_name, body=news_articles)

    return jsonify({"result": "success"})


if __name__ == '__main__':
    app.run(port=5000)