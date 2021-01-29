import redis
from starlette.requests import Request
import yaml

from typing import Union, List


def register_db(host: str, port: int, db: Union[int, List[int]]):
    if not isinstance(db, list):
        db = [db]
    pool = [redis.ConnectionPool(host=host, port=port, db=i) for i in db]

    def get_database(db: int):
        r = redis.StrictRedis(connection_pool=pool[db])
        return r
    return get_database


with open('./config.yml', 'r') as f:
    config = yaml.safe_load(f)['redis']

get_database = register_db(
    host=config['host'],
    port=config['port'],
    db=config['db']
)
