// https://www.sitepoint.com/javascript-design-patterns-singleton/
//https://gist.github.com/dmnsgn/4a6ad76de1b5928f13f68f406c70bb09

class Storage {
  constructor() {
    this._cityIOurl = "";
  }
  //reqAnimFrame
  get reqAnimFrame() {
    return this._reqAnimFrame;
  }
  set reqAnimFrame(value) {
    this._reqAnimFrame = value;
  }
  //cityIO url
  get cityIOurl() {
    return this._cityIOurl;
  }
  set cityIOurl(value) {
    this._cityIOurl = value;
  }
  //map obj
  get map() {
    return this._map;
  }
  set map(value) {
    this._map = value;
  }

  //tableExtents
  get tableExtents() {
    return this._tableExtents;
  }
  set tableExtents(value) {
    this._tableExtents = value;
  }

  //cityIO data
  get cityIOdata() {
    return this._cityIOdata;
  }
  set cityIOdata(value) {
    this._cityIOdata = value;
  }

  //grid CityIO data
  get gridCityIOData() {
    return this._gridCityIOData;
  }
  set gridCityIOData(value) {
    this._gridCityIOData = value;
  }

  //cityIO data
  get cityIOdata_OLD() {
    return this._cityIOdata;
  }
  set cityIOdata_OLD(value) {
    this._cityIOdata = value;
  }

  //threeJs grid
  get threeGrid() {
    return this._threeGrid;
  }
  set threeGrid(value) {
    this._threeGrid = value;
  }

  //threeJs height state for projection
  get threeState() {
    return this._threeState;
  }
  set threeState(value) {
    this._threeState = value;
  }
}

export default new Storage();
