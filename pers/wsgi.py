from pers import create_app
import os
from waitress import serve

app = create_app()

if __name__ == "__main__":
    from os import environ

    serve(app, host='0.0.0.0', port=environ.get("PORT", 5000), url_scheme='https')