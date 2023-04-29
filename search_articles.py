from elasticsearch import Elasticsearch

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

if __name__ == "__main__":
    es = Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])
    index_name = "news_articles"
    
    # Prompt the user to enter a search query
    search_query = input("Enter a search query: ")

    # Search for articles containing the keyword entered by the user
    search_results = search_articles(es, index_name, search_query)

    # Print the search results
    print("Search results for query '{}':".format(search_query))
    for result in search_results:
        print(result["_source"])