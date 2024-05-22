from flask import Blueprint
from api import handler

bp = Blueprint("ass4", __name__)

bp.add_url_rule("/ping", view_func=handler.ping, methods=["GET"], endpoint="ping")
bp.add_url_rule("/reset", view_func=handler.reset, methods=["POST"], endpoint="reset")
bp.add_url_rule("/get_point", view_func=handler.get_point, methods=["POST"], endpoint="get_point")
bp.add_url_rule("/level", view_func=handler.change_level, methods=["POST"], endpoint="level")
bp.add_url_rule("/register", view_func=handler.register_user, methods=["POST"], endpoint="register_user")
bp.add_url_rule("/get_match_index/<string:user>", view_func=handler.get_match_index, methods=["GET"], endpoint="get_match_index")
bp.add_url_rule("/get_match/<int:index>", view_func=handler.get_match, methods=["GET"], endpoint="get_match")
bp.add_url_rule("/play", view_func=handler.play, methods=["POST"], endpoint="play")
