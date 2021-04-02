import { SelectionLayer} from 'nebula.gl';

const setRoboscopeGrid = (new_features, setScale, setSelectedFeaturesState, tableDim, data) => {
  let length_row = 0;
  for(let i = 0; i < new_features.length; i++){ 
    if (new_features[i+1]-new_features[i]>1) {
      length_row= new_features[i]-new_features[0];
      break;
    }
  }  
  let scale = (length_row < tableDim[0]) ? Math.floor(tableDim[0]/length_row) : 1;
  let output = []  
  for (let row=0; row<tableDim[1]/scale; row++) {
    for (let col=0; col<tableDim[0]/scale; col++) {
      output.push(new_features[0]+(row*data.properties.header.ncols)+col);
    }
  }
  setScale(scale)
  setSelectedFeaturesState(output)
}

export default function RoboscopeSelection({
    data,
    editOn,
    state: { menu, tableDim,  },
    updaters: { setSelectedFeaturesState, setScale},
    deckGL,
}) {
  return new SelectionLayer({
    id: 'selection',
    selectionType: 'rectangle',
    onSelect: ({ pickingInfos }) => {
      if (!menu.includes("EDIT")) {
        const new_features = pickingInfos.map((pi) => pi.index);
        new_features.sort((a,b) => a-b);
        setRoboscopeGrid(new_features, setScale, setSelectedFeaturesState, tableDim, data);
      }
    },
    layerIds: ['GRID'],
    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 1,
  }) 
}
