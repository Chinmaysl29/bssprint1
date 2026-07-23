import json
import os
import sys
import re

# Force the working directory to be the project root
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from src.api.main import app
from fastapi.openapi.utils import get_openapi

def export_docs():
    os.makedirs("docs", exist_ok=True)
    
    # 1. OpenAPI JSON
    # We must generate the openapi schema manually since app.openapi() expects the app to have been fully loaded
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )
    with open("docs/openapi.json", "w") as f:
        json.dump(openapi_schema, f, indent=2)
        
    # 2. Postman Collection v2.1.0
    postman_collection = {
        "info": {
            "name": "Nifty100 API (FastAPI)",
            "description": "Postman collection generated from FastAPI routes.",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": []
    }
    
    folders = {}
    
    for route in app.routes:
        if hasattr(route, "methods") and hasattr(route, "path"):
            if not route.path.startswith("/api/v1"):
                continue
                
            methods = [m for m in route.methods if m != "HEAD"]
            if not methods:
                continue
            method = methods[0]
            
            tag = route.tags[0] if getattr(route, "tags", None) else "default"
            
            # Postman item format requires URL array formatting
            path_parts = [p.strip("/") for p in route.path.split("/") if p]
            
            variables = []
            for var in re.findall(r'{(.*?)}', route.path):
                variables.append({
                    "key": var,
                    "value": f"sample_{var}"
                })
                
            # Convert {var} to :var for Postman parsing
            raw_url = "http://localhost:8000" + re.sub(r'{(.*?)}', r':\1', route.path)
            
            item = {
                "name": route.name or route.path,
                "request": {
                    "method": method,
                    "url": {
                        "raw": raw_url,
                        "host": ["http://localhost:8000"],
                        "path": path_parts,
                        "variable": variables
                    }
                }
            }
            
            if tag not in folders:
                folders[tag] = {
                    "name": tag.capitalize(),
                    "item": []
                }
                
            folders[tag]["item"].append(item)
            
    postman_collection["item"] = list(folders.values())
    
    with open("docs/postman_collection.json", "w") as f:
        json.dump(postman_collection, f, indent=2)

if __name__ == "__main__":
    export_docs()
    print("Successfully exported docs/openapi.json and docs/postman_collection.json")
