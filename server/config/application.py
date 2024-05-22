from flask import Flask
from flask_cors import CORS
from api.router import bp
from config.config import Config


def config(app: Flask) -> Flask:
    app.config.from_object(Config)
    return app


def register_blueprint(app: Flask) -> Flask:
    app.register_blueprint(bp)
    return app


def init_app() -> Flask:
    app = Flask(__name__)
    app = config(app)
    CORS(app, supports_credentials=True)  # TODO: ensure correct security for CORS
    app = register_blueprint(app)
    return app
