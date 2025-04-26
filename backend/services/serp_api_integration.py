import requests
import os

# TO:DO: Replace the key here with the SERP-API key
SERP_API_KEY = os.getenv("SERP_API_KEY", "your_serp_api_key_here")


def search_serpapi(zipcode, query, engine):
    url = "https://serpapi.com/search.json"
    params = {
        "engine": engine,
        "q": query,
        "location": zipcode,
        "api_key": SERP_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return None


def extract_fields(place):
    return {
        "title": place.get("title"),
        "address": place.get("address"),
        "rating": place.get("rating"),
        "reviews": place.get("reviews"),
        "place_id": place.get("place_id"),
        "gps_coordinates": place.get("gps_coordinates"),
        "website": place.get("website"),
        "directions": place.get("directions")
    }


def search_resources_service(zipcode, resource_type):
    if not zipcode or not resource_type:
        raise ValueError("Missing zipcode or resource_type")

    if resource_type == "shelter":
        queries = [
            f"Shelter for homeless near {zipcode}",
            f"Free homeless shelters near {zipcode}",
            f"Open shelters/emergency shelters near {zipcode}"
        ]
    elif resource_type == "food":
        queries = [
            f"Free food near {zipcode}",
            f"Food donation centers near {zipcode}",
            f"Places offering free meals near {zipcode}"
        ]
    else:
        raise ValueError("Invalid resource_type. Must be 'shelter' or 'food'.")

    combined_results = {}

    for engine in ["google_maps", "google", "google_local"]:
        for query in queries:
            search_result = search_serpapi(zipcode, query, engine)
            if search_result and "local_results" in search_result:
                for place in search_result["local_results"]:
                    place_info = extract_fields(place)
                    place_id = place_info.get("place_id")
                    if place_id and place_id not in combined_results:
                        combined_results[place_id] = place_info

    return list(combined_results.values())
