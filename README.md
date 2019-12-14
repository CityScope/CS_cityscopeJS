In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Brushing

```
import { BrushingExtension } from "@deck.gl/extensions";
this.brushingExtension = new BrushingExtension();
// ! handle brushing selection
brushingRadius: 100,
brushingEnabled: true,
radiusScale: 100,
extensions: [this.brushingExtension]
```
