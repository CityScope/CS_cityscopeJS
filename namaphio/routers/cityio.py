from fastapi import APIRouter
from fastapi.responses import ORJSONResponse

from typing import List, Dict, Any

router = APIRouter(
    prefix='/cityio',
    tags=['compat'],
)


@router.get("/tables/list")
async def list_tables():
    """io_list_tables
      List up whole tables in DB

    Returns:
    List[]
    """
    pass


@router.get("/table/{table}")
async def get_table(
    table: str
):
    pass


@router.post("/table/update/{table}/{field}")
async def post_table(
    table: str,
    field: str = None
):
    pass


@router.get("/table/clear/{table}/{field}")
async def delete_table(
    table: str,
    field: str = None
):
    pass
