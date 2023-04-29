from elasticsearch import Elasticsearch

es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])
index_name = "news_articles"

news_articles = {
    "title": input('Enter title: '),
    "text": input('Enter text: ')
}

es.index(index=index_name, body=news_articles)