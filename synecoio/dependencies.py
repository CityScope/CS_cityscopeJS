from starlette.requests import Request

from internal.redis import get_database


def get_connection(request: Request):
    return request.state.connection


async def connect_database(request: Request):
    return lambda db: get_database(db)
