from fastapi import FastAPI
from fastapi import Query, Path

from typing import List, Dict, Any, Optional
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


async def root():
    """Root
      Returns constant welcome message. Use this when you check the connection.

    Returns:
      Dict[str, str]: Welcome to SynecoAI!!
    """
    return {'msg': 'welcome to SynecoIO!!'}


async def list_tables():
    """List Tables
      List up all tables in DB

    Returns:
      List[str]: Table names
    """
    pass


async def get_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators'])
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    pass


async def post_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators'])
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    pass


async def delete_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators'])
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    pass


APIList = [
    {
        "path": '/',
        "type": 'get',
        "func": root
    },
    {
        "path": '/tables',
        "type": "get",
        "func": list_tables
    },
    {
        "path": '/table/{table}',
        "type": "get",
        "func": get_table
    },
    {
        "path": '/table/{table}',
        "type": "post",
        "func": post_table
    },
    {
        "path": '/table/{table}',
        "type": "delete",
        "func": delete_table
    }
]


register_api = _register_func(APIList)
