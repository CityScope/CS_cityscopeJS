// https://www.sitepoint.com/javascript-design-patterns-Storage/
//https://gist.github.com/dmnsgn/4a6ad76de1b5928f13f68f406c70bb09

class Storage {
  constructor() {
    if (!Storage.instance) {
      Storage.instance = this;
    }
    // Initialize object
    return Storage.instance;
  }

  //boolGridDataSource (cityio vs local)
  get boolGridDataSource() {
    return this._boolGridDataSource;
  }
  set boolGridDataSource(value) {
    this._boolGridDataSource = value;
  }

  //girdLocalDataSource
  get girdLocalDataSource() {
    return this._girdLocalDataSource;
  }
  set girdLocalDataSource(value) {
    this._girdLocalDataSource = value;
  }

  //gird CityIO Data Source
  get girdCityIODataSource() {
    return this._girdCityIODataSource;
  }
  set girdCityIODataSource(value) {
    this._girdCityIODataSource = value;
  }

  //selected Grid Cells
  get selectedGridCells() {
    return this._selectedGridCells;
  }
  set selectedGridCells(value) {
    this._selectedGridCells = value;
  }

  //ABMmodeType
  get ABMmodeType() {
    return this._ABMmodeType;
  }
  set ABMmodeType(value) {
    this._ABMmodeType = value;
  }

  //ABMmodeType
  get ABMdata() {
    return this._ABMdata;
  }
  set ABMdata(value) {
    this._ABMdata = value;
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

  // cityIOPostURL
  get cityIOPostURL() {
    return this._cityIOPostURL;
  }
  set cityIOPostURL(value) {
    this._cityIOPostURL = value;
  }

  //map obj
  get map() {
    return this._map;
  }
  set map(value) {
    this._map = value;
  }

  //cityIO header
  get cityioHeader() {
    return this._cityioHeader;
  }
  set cityioHeader(value) {
    this._cityioHeader = value;
  }

  // gridGeojsonActive
  get gridGeojsonActive() {
    return this._gridGeojsonActive;
  }
  set gridGeojsonActive(value) {
    this._gridGeojsonActive = value;
  }

  //oldAHashList
  get oldAHashList() {
    return this._oldAHashList;
  }
  set oldAHashList(value) {
    this._oldAHashList = value;
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

  //3d height state for projection
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
