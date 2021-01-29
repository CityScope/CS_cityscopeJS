import requests
from enum import Enum
from typing import NamedTuple, Dict, Union

JSON = Dict[str, Union[str, int, float, bool]]

# Meta Datas
class ReqType(Enum):
    UNDEFINED = 0
    GET = 1
    POST = 2

class Message(NamedTuple):
    name: Dict[str, str] = {}
    content: JSON = {}

class Req(NamedTuple):
    reqtype: ReqType
    routing: str
    
    def replace(self, message: Message):
        temp = self.routing
        for k, v in message.name.items():
            temp = temp.replace(f":{k}", v)
        return temp
    
    def __call__(self, message:Message = Message()):
        if self.reqtype == ReqType.GET:
            res = requests.get(self.replace(message))
        if self.reqtype == ReqType.POST:
            res = requests.post(self.replace(message), json=message.content)
        return res

class APIClient():
    def __init__(self, endpoint="https://cityio.media.mit.edu/api"):
        self.endpoint = endpoint
        self.ListTables   = Req(ReqType.GET,  f"{self.endpoint}/tables/list")
        self.GetTable     = Req(ReqType.GET,  f"{self.endpoint}/table/:tableName")
        self.PostTable    = Req(ReqType.POST, f"{self.endpoint}/table/update/:tableName/:fieldName")
        self.DeleteTable  = Req(ReqType.GET,  f"{self.endpoint}/table/clear/:tableName/:fieldName")
        self.DeleteModule = Req(ReqType.GET,  f"{self.endpoint}/table/clear/:tableName/:moduleName")
    def __repr__(self):
      return \
f"""APIClient(
  ListTables   :
  GetTable     : tableName
  PostTable    : tableName, fieldName
  DeleteTable  : tableName, fieldName
  DeleteModule : tableName, moduleName
)"""