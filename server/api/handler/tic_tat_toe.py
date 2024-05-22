from flask import request
from api.handler import api_response
from flask import request
import usecase


def ping():
    return api_response.response_success("pong")


def reset():
    data = request.get_json()
    size = data["size"]
    usecase.initialize(size)
    return api_response.response_success("Reset successfully")


def get_point():
    data = request.get_json()
    x = data["x"]
    y = data["y"]
    ay, ax, state = usecase.get_point(x, y)
    return api_response.response_success({"x": ax, "y": ay, "state": state})


def change_level():
    data = request.get_json()
    level = data["level"]
    level = usecase.change_level(level)
    return api_response.response_success({"level": level})


def register_user():
    data = request.get_json()
    user = data["user"]
    user = usecase.register_user(user)
    return api_response.response_success({"user": user})


def get_match_index(user):
    index = usecase.get_match_index(user)
    return api_response.response_success({"id": index})


def get_match(index):
    match = usecase.get_match(index)
    return api_response.response_success(match)


def play():
    data = request.get_json()
    index = data["index"]
    user = data["user"]
    y = data["y"]
    x = data["x"]
    is_fault = usecase.play(index, user, x, y)
    if is_fault:
        return api_response.response_success("OK")
    else:
        return api_response.response_success("NG")
