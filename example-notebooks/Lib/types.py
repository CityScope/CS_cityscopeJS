from typing import Dict, List, Callable, Any, Union, NamedTuple
import numpy as np

JSON = Dict[str, Union[str, int, float, bool]]

class Meta(NamedTuple):
    """
    Meta data container supporting the format of CityIO v2.0
    """
    hashes: Dict[str, str] = {}
    id: str = ""
    timestamp: int = ""
    apiv: str = "2.0"

class Header(NamedTuple):
    """
    Header data
    Note: See also
    https://github.com/CityScope/cityscope.github.io/wiki/CityIO-Data-Structure-Standard-version-2.1
    """
    name: str = ""
    spatial: Dict[str, Union[int, float]] = {}
    owner: Dict[str, str] = {}
    block: List[str] = ['type', 'height', 'rotation']
    mapping: Dict[str, str] = {"0": "RL", "1": "RM", "2": "RS"}

class IndicatorObject(NamedTuple):
    indicator_type: str = ""
    name: str = ""
    value: float = 0
    viz_type: str = ""
    category: str = ""
    raw_value: float = 0
    units: str = ""

class Geometry(NamedTuple):
    type: str = ""
    coordintes: List[float] = []

class GEOProperty(NamedTuple):
    color: List[int] = []
    height: int = 0
    id: int = 0
    interactive: str = ""
    name: str = ""

class GEOType(NamedTuple):
    class LandUse(NamedTuple):
        proportion: float = 0
        use: Dict[str, float] = {}
    LBCS: List[LandUse] = {}
    NAICS: List[LandUse] = {}
    color: str = "#ffffff"
    height: str = "1"
    interactive: str = "web"
    name: str = ""
    tableData: Dict[str, Any] = {}


class Access(NamedTuple):
    class Feature(NamedTuple):
        type: str = ""
        geometry: Geometry = Geometry()
        properties: List[float] = []

    type: str = ""
    properties: List[str] = []
    features: List[Feature] = []

    
class GEOGRID(NamedTuple):
    class Feature(NamedTuple):
        geometry: Geometry = Geometry()
        properties: List[GEOProperty] = []
        type: str = ""
    
    type: str = ""
    features: List[Feature] = []
    properties: Dict[str, Any] = {}
      
class SynecoIOTable():
    """
    Table which supports CityIO v2.0
    Note: If you try to manage the data, use SynecoTable class instead.
    """
    meta: Meta
    header: Header
    GEOGRID: GEOGRID
    GEOGRIDDATA: List[GEOProperty]
    indicators: List[IndicatorObject]
    access: Access
    
    def __init__(self, cont: JSON):
        for k in cont.keys():
            if k == 'meta':
                self.meta = self.__annotations__[k](**cont[k])
            elif k == 'header':
                self.header = self.__annotations__[k](**cont[k])
            elif k=='GEOGRID':
                self.GEOGRID = self.__annotations__[k](**cont[k])
            elif k=='GEOGRIDDATA':
                self.GEOGRIDDATA = [GEOProperty(**i) for i in cont[k]]
            elif k=='indicators':
                self.indicators = [IndicatorObject(**i) for i in cont[k]]
            elif k=='access':
                self.access = self.__annotations__[k](**cont[k])
            else:
                print(f'Drop Non Registered Field: {k}')
                
                
class Geogrid():
  types: np.ndarray
  height: np.ndarray
  props: np.ndarray
    
  def __init__(self, grid:List[Dict[str, Any]], types: List[GEOType], nrow:int, ncol:int):
    self.types = np.zeros(ncol*nrow, dtype=np.uint8)
    self.height = np.zeros(ncol*nrow, dtype=np.uint8)
    self.props = np.zeros(ncol*nrow, dtype=np.object)
    
    type_annot = {v.name: idx for idx, v in enumerate(types)}

    for gr in grid:
      props = set(gr.keys()) - set(['name', 'height', 'id'])
      i = gr['id']      
      self.types[i] = type_annot[gr['name']]
      self.height[i] = gr['height']
      self.props[i] = {p: gr[p] for p in props}
    
    self.types.shape = (nrow, ncol)
    self.height.shape = (nrow, ncol)
    self.props.shape = (nrow, ncol)
  
  @property
  def shape(self) -> tuple:
    return self.types.shape
  
  def __repr__(self) -> str:
    return \
f"""Geogrid(
  types: {self.types}
  height: {self.height}
  props: {self.props}
)"""