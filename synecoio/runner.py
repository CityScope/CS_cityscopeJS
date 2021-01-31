from simulators.example import random_heatmap, CumsumHeatpmap
from simulators import Simulator, Module

simulator = Simulator()

simulator.setup([
    Module(
        name='Econimpact',
        in_field='Geogrid',
        func=random_heatmap
    ),
    Module(
        name='Ecoimpact',
        in_field='Geogrid',
        func=CumsumHeatpmap()
    )
])
