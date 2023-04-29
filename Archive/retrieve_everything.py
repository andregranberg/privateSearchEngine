from elasticsearch import Elasticsearch

# Create an Elasticsearch client
es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])

# Define the index name
index_name = "news_articles"

# Define the query to retrieve all documents from the index
query = {"query": {"match_all": {}}}

# Execute the search query
result = es.search(index=index_name, body=query)

# Print the retrieved documents
for hit in result["hits"]["hits"]:
    print(hit["_source"])