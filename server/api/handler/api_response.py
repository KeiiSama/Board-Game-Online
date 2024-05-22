from flask import Response, jsonify
from typing import Union, Optional, Tuple

API_Response = Tuple[Response, int]


def response(
    body: Optional[Union[dict, str]], code: int, cookies: Optional[dict] = None
) -> API_Response:
    result = jsonify(body)
    if cookies:
        for key in cookies:
            result.set_cookie(key, str(cookies[key]))
    return result, code


def response_success(body: any = None) -> API_Response:
    if not body:
        body = {"message": "Success"}
    return response(body, 200)
