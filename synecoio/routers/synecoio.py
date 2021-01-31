from fastapi import APIRouter
from fastapi import Query, Path, Depends, Response, status, Body, HTTPException

from typing import List, Dict, Any, Optional, Union, Callable
from fastapi.responses import ORJSONResponse

import hashlib
import re
import json
from dependencies import connect_database

router = APIRouter(
    prefix="",
    tags=[],
    default_response_class=ORJSONResponse,
)

re_mod = re.compile('Mod:')


# DB structure
# DB[0]
#  - Tables: Set, List of all tables
#  - {Table}: Hash, Meta Field of each Table
#    - Meta: str, Constant meta data like apiversion
#    - Header: str, Hash info
#    - Types: str, Hash info
#    - GeoGrid: str, Hash info
#    - Mod:{Module}: str, Hash info
#
# DB[1]
#  - {Table}: Hash, Contents
#    - Header: str, User configure
#    - Types: str, Types info used in GeoGrid and Mods
#    - GeoGrid: str, Geometry info bound with grids
#    - Mod:{Module}: str, module output data


def get_field(db, table: str, field: Union[str, List[str]]):
    res = {}
    for _f in field:
        f = _f.capitalize()
        if f == 'Meta':
            cont = db(0).hgetall(table)
            temp = json.loads(cont.pop(b'meta'))
            temp[b'hashes'] = cont
        elif f in ['Header', 'Types', 'Geogrid']:
            temp = json.loads(db(1).hget(table, f))
        elif f == 'Modules':
            f = 'Modules'
            temp = {}
            for i in [k.decode() for k in db(1).hkeys(table)]:
                if re_mod.match(i):
                    temp[re_mod.sub('', i)] = json.loads(db(1).hget(table, i))
        elif re_mod.match(f):
            f = f"Mod:{re_mod.sub('', f).capitalize()}"
            cont = db(1).hget(table, f)
            if cont is None:
                raise HTTPException(status_code=404, detail=f"Field not found > {_f}")
            temp = json.loads(cont)
        else:
            raise HTTPException(status_code=404, detail=f"Field not found > {_f}")
        res[f] = temp
    return res


def check_bodykeys(body: Dict[str, Any]):
    res = []

    for k, v in body.items():
        f = k.capitalize()
        if re_mod.match(f):
            f = f"Mod:{re_mod.sub('', f).capitalize()}"
            res.append([f, v])
        elif f in ['Header', 'Types', 'Geogrid']:
            res.append([f, v])
        elif f == 'Modules':
            for modk, modv in v.items():
                res.append([f"Mod:{modk.capitalize()}", modv])
        elif f == 'Meta':
            raise HTTPException(status_code=403, detail=f"DO NOT EDIT META FIELD")
        else:
            raise HTTPException(status_code=404, detail=f"Field not found > {k}")
    return res


def check_db(db, table: str, field: List[str]):
    res = []

    for _f in field:
        f = _f.capitalize()
        if f in ['Header', 'Types', 'Geogrid']:
            res.append([f, '{}'])
        elif f == 'Modules':
            for k in [i.decode() for i in db(1).hgetall(table)]:
                if re_mod.match(k):
                    res.append([k, None])
        elif re_mod.match(f):
            f = f"Mod:{re_mod.sub('', f).capitalize()}"
            is_match = [1 if f == i.decode() else 0 for i in db(1).hgetall(table)]
            if sum(is_match) == 0:
                raise HTTPException(status_code=404, detail=f"Field not found > {_f}")
            res.append([f, None])
        elif f == 'Meta':
            raise HTTPException(status_code=403, detail=f"DO NOT EDIT META FIELD")
        else:
            raise HTTPException(status_code=404, detail=f"Field not found > {_f}")
    return res


@router.get('/tables')
async def list_tables(
    db: Optional[Any] = Depends(connect_database)
):
    """List Tables
      List up all tables on DB

    Returns:
      List[str]: Table names
    """
    return db(0).smembers('Tables')


@router.get('/table/{table}')
async def get_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(None, title="Field names in Table", example=['geogrid', 'modules', 'mod:indicator']),
    db: Optional[Any] = Depends(connect_database)
):
    """Get Table
      Get all fields on the table

    Args:
      table(str): Table name
      field(List[str]): Field names in Table. Default to None.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    if field is None:
        temp = db(0).hgetall(table)
        meta = json.loads(temp.pop(b'meta'))
        meta[b'hashes'] = temp

        cont = db(1).hgetall(table)
        mods = {}
        for _k in list(cont.keys()):
            k = _k.decode()
            if k in ('Header', 'Geogrid', 'Types'):
                cont[_k] = json.loads(cont[_k])
            else:
                mods[re_mod.sub("", k)] = json.loads(cont.pop(_k))
        return {'Meta': meta, 'Modules': mods, **cont}
    return get_field(db, table, field)


@router.post('/table/{table}')
async def post_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    body: Optional[Dict[str, Any]] = Body(..., title="Content", example={'Mod:Test1': {'value': 1}, 'Mod:Test2': [2]}),
    db: Optional[Any] = Depends(connect_database)
):
    """Post Table
      Post body contents on the table.
      Body should be a dict object, and its top level keys set to the Field on the Table.

    Args:
      table(str): Table name
      body(Dict[str, Any]): Pair of fieldName and its content

    Returns:
        None: Response 200
        str: Response 403
        str: Response 404
    """
    que = check_bodykeys(body)
    for field, _cont in que:
        cont = json.dumps(_cont)
        db(1).hset(table, field, cont)
        db(0).hset(table, field, hashlib.sha256(cont.encode()).hexdigest())
    return Response(status_code=status.HTTP_200_OK)


@router.delete('/table/{table}')
async def delete_table(
    table: Optional[str] = Path(..., title="Table name in DB", example='roppongi'),
    field: Optional[List[str]] = Query(..., title="Field names in Table", example=['Mod:Test1', 'Mod:Test2']),
    db: Optional[Any] = Depends(connect_database)
):
    """Delete Table
      Delete fields on the table

    Args:
      table(str): Table name
      field(List[str]): Field names on Table.

    Returns:
      Dict[str, Any]: Table fiels specified in `field` argument. If field was None, return all of the fields.
    """
    que = check_db(db, table, field)
    for field, state in que:
        if state is None:
            db(1).hdel(table, field)
            db(0).hdel(table, field)
        else:
            db(1).hset(table, field, state)
            db(0).hset(table, field, state)
    return Response(status_code=status.HTTP_200_OK)
