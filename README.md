# namaph
`namaph` is a unified framework for visualizing Ecosystem simulation.
This project is forked by CityScopeJS.

## Requirements
- `docker`
- [Optional] `nodejs`
- [Optional] `yarn`
- [Optional] `python`

## How to start?
1. Run `docker-compose up -d`
2. You can access to ...
  - synecoio server with `http://localhost:8080` or `http://localhost:8080/docs`
  - synecoscope `http://localhost:8000`

### Run the servers on local (without docker)
#### CityScopeJS(Old)
1. [Install Package] run `yarn install` or `npm install`
2. [Start Server] run `yarn start` or `npm start`
3. [Play] open your browser and access to `http://localhost:3000/CS_cityscopeJS`

#### namaphio
1. Run `pip install pipenv`
2. Run `cd synecoio && pipenv shell`
3. Run `pipenv install`
4. Run `uvicorn main:app --reload --port 8080 --host 0.0.0.0`

## Reference
- CityScopeJS Documentation: https://cityscope.media.mit.edu/docs/frontend/CityScopeJS
