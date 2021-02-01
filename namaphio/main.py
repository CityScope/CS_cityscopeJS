from fastapi import FastAPI
from starlette.requests import Request

from typing import Optional, List

import routers.cityio as cityio
import routers.namaphio as namaphio
import routers.simio as simio

app = FastAPI()


@app.get('/')
async def root():
    """Root
      Returns constant welcome message. Use this when you check the connection.

    Returns:
      Dict[str, str]: Welcome to namaphIO!!
    """
    return {'msg': "welcome to namaphIO!! documents're located baseurl/docs"}

app.include_router(namaphio.router)
app.include_router(simio.router)
app.include_router(cityio.router)
