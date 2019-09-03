from pers import app
import os
from waitress import serve

if __name__ == "__main__":
    from os import environ

    serve(app, host='0.0.0.0', port=environ.get("PORT", 8000), url_scheme='https')