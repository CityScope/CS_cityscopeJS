from fastapi import FastAPI
from typing import List, Dict, Any
from fastapi.responses import ORJSONResponse


def _register_func(APIList: List[Dict[str, Any]]):
    def register_func(app: FastAPI, tags: List[str] = None):
        assert isinstance(tags, List) or tags is None, 'tags must be a list'
        for api in APIList:
            cont = {
                "path": api['path'],
                "response_class": ORJSONResponse,
                "tags": tags
            }
            if api['type'] == 'get':
                app.get(**cont)(api['func'])
            elif api['type'] == 'post':
                app.post(**cont)(api['func'])
            elif api['type'] == 'delete':
                app.delete(**cont)(api['func'])
        return [api['path'] for api in APIList]
    return register_func


async def list_tables():
    """io_list_tables
      List up whole tables in DB

    Returns:
    List[]
    """
    pass


async def get_table(
    table: str
):
    pass


async def post_table(
    table: str,
    field: str = None
):
    pass


async def delete_table(
    table: str,
    field: str = None
):
    pass


APIList = [
    {
        "path": '/cityio/tables/list',
        "type": 'get',
        "func": list_tables
    },
    {
        "path": '/cityio/table/{table}',
        "type": 'get',
        "func": get_table
    },
    {
        "path": '/cityio/table/update/{table}/{field}',
        "type": 'post',
        "func": post_table
    },
    {
        "path": '/cityio/table/clear/{table}/{field}',
        "type": 'get',
        "func": delete_table
    }
]

register_api = _register_func(APIList)
