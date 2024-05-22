import os
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(env_path)


class Config(object):
    # Flask Config
    FLASK_PORT = os.getenv("FLASK_PORT")
    FLASK_HOST = os.getenv("FLASK_HOST")
    DEBUG = os.getenv("DEBUG") == "True"

    CORS_EXPOSE_HEADERS = "*,*"
