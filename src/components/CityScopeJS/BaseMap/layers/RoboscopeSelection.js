import { SelectionLayer} from 'nebula.gl';

const roundHalf = (num) => {
    return Math.round(num*2)/2;
}

const setRoboscopeGrid = (new_features) => {
  let length_row = 0;
  for(let i = 0; i < new_features.length; i++){ 
    if (new_features[i+1]-new_features[i]>1) {
      length_row= new_features[i]-new_features[0];
      break;
    }
  }
  let scale = roundHalf(length_row/8);
  let output = []
  for (let row=0; row<scale*12; row++) {
    for (let col=0; col<scale*8; col++) {
      output.push(new_features[0]+(row*24)+col);
    }
  }
  return [scale, output]
}

export default function RoboscopeSelection({
    data,
    editOn,
    state: { menu },
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
        let [scale, output] = setRoboscopeGrid(new_features);
        setScale(scale);
        setSelectedFeaturesState(output);
      }
    },
    layerIds: ['GRID'],
    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 1,
  }) 
}
