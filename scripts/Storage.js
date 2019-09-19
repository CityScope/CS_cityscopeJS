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

  //cityIO data
  get cityIOdata() {
    return this._cityIOdata;
  }
  set cityIOdata(value) {
    this._cityIOdata = value;
  }

  // gridGeojson
  get gridGeojson() {
    return this._gridGeojson;
  }
  set gridGeojson(value) {
    this._gridGeojson = value;
  }

  // gridGeojsonActive
  get gridGeojsonActive() {
    return this._gridGeojsonActive;
  }
  set gridGeojsonActive(value) {
    this._gridGeojsonActive = value;
  }

  //Old hash
  get oldGridHash() {
    return this._oldGridHash;
  }
  set oldGridHash(value) {
    this._oldGridHash = value;
  }

  //oldAHashList
  get oldAHashList() {
    return this._oldAHashList;
  }
  set oldAHashList(value) {
    this._oldAHashList = value;
  }

  //firstLoadFlag
  get firstLoadFlag() {
    return this._firstLoadFlag;
  }
  set firstLoadFlag(value) {
    this._firstLoadFlag = value;
  }

  //grid CityIO data
  get gridCityIOData() {
    return this._gridCityIOData;
  }
  set gridCityIOData(value) {
    this._gridCityIOData = value;
  }

  //updateLayersInterval
  get updateLayersInterval() {
    return this._updateLayersInterval;
  }
  set updateLayersInterval(value) {
    this._updateLayersInterval = value;
  }

  //threeJs height state for projection
  get threeState() {
    return this._threeState;
  }
  set threeState(value) {
    this._threeState = value;
  }

  //mobilitySliderState
  get mobilitySliderState() {
    return this._mobilitySliderState;
  }
  set mobilitySliderState(value) {
    this._mobilitySliderState = value;
  }
}

export default new Storage();
