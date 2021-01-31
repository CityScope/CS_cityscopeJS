from fastapi import FastAPI
from starlette.requests import Request

from typing import Optional, List

import routers.cityio as cityio
import routers.synecoio as synecoio
import routers.simio as simio

app = FastAPI()


@app.get('/')
async def root():
    """Root
      Returns constant welcome message. Use this when you check the connection.

    Returns:
      Dict[str, str]: Welcome to SynecoAI!!
    """
    return {'msg': "welcome to SynecoIO!! documents're located baseurl/docs"}

app.include_router(synecoio.router)
app.include_router(simio.router)
app.include_router(cityio.router)
