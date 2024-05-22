from config.config import Config
from config.application import init_app

if __name__ == "__main__":
    app = init_app()

    # Config for running Flask app:
    port = Config.FLASK_PORT
    host = Config.FLASK_HOST
    debug = Config.FLASK_HOST
    app.run(host=host, port=port, debug=debug, use_reloader=False)
