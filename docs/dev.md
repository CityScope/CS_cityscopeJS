# Development

CityScopeJS is being constantly developed through its frontend, backend and modules. This repo is subject to breaking changes.

In the project directory, you can run: `npm start` Runs the app in the development mode.<br /> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Usage

-   Start by adding CityScope table name to the URL (in the form of: `...URL/?__yourTableName__`)
-   Look for other active tables in cityIO

### Mock cityIO API

Sometimes, cityIO service is down, or you'd like to stress-test things that might burden cityIO. To mock the API, install `json-server` https://github.com/typicode/json-server:

`npm install -g json-server`

and then go to the mocked cityIO API JSON file in `docs/mockAPI` and run:

`json-server --watch mockAPI.json --port 3001`

then, use this URL to run the app in the mocked server env:

`http://localhost:3000/cityscope=mockAPI`

Note that the mocked API only holds minimal data for running the dev env, but not the full API.

### Hard-Reset cityIO `GEOGRIDDATA` field

**Note!** This feature involves permanent data loss.

If your dev created odd data for the grid, you can quickly reset it via:
`$ curl https://cityio.media.mit.edu/api/table/clear/__TABLE_NAME__/GEOGRIDDATA`
