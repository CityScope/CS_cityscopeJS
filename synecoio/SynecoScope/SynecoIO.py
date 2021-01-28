from fastapi import FastAPI

import api.cityio as cityio
import api.synecoio as synecoio

from typing import Optional, List

app = FastAPI()

synecoio.register_api(app)
cityio.register_api(app, ['cityio'])
