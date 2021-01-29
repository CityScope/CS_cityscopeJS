from fastapi import APIRouter
from fastapi import Query, Path, Depends

from typing import List, Dict, Any, Optional
from fastapi.responses import ORJSONResponse

from dependencies import connect_database

router = APIRouter(
    prefix="",
    tags=[],
    default_response_class=ORJSONResponse,
)


@router.get('/tables')
async def list_tables(
    db: Optional[Any] = Depends(connect_database)
):
    """List Tables
      List up all tables in DB

    Returns:
      List[str]: Table names
    """
    return db(0).keys()


@router.get('/table/{table}')
async def get_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators']),
    db: Optional[Any] = Depends(connect_database)
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    if field is None:
        pass
    else:
        pass
    return db.keys()


@router.post('/table/{table}')
async def post_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators']),
    db: Optional[Any] = Depends(connect_database)
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    if field is None:
        pass
    else:
        pass
    return {}


@router.delete('/table/{table}')
async def delete_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicators']),
    db: Optional[Any] = Depends(connect_database)
):
    """Get Table
      Get all fields in the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    if field is None:
        pass
    else:
        pass
    return {}
