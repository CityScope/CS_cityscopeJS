
# %%

import json
import os
import sys
import random

file_dir = os.path.dirname('grid_geojson')
sys.path.append(file_dir)
from grid_geojson import *  # nopep8


# %% [markdown]
# Specify the properties of the grid

# %%


# Full table
top_left_lat = 19.050979614257812
top_left_lon = 47.43630292431787

# Active Area
top_left_lon = 19.050979614257812
top_left_lat = 47.43630292431787


# Full table
nrows = 30
ncols = 50

# Active Area
nrows = 15
ncols = 15

# rotation
rotation = 260
# cell size
cell_size = 50

# projection system
crs_epsg = '3836'

properties = {
    'id': [i for i in range(nrows*ncols)],
    'usage': [0 for i in range(nrows*ncols)],
    'height': [-100 for i in range(nrows*ncols)],
    'pop_density': [2 for i in range(nrows*ncols)]}


# %% [markdown]
# Compute the geojson as a dict

# %%
results_grid = Grid(top_left_lon, top_left_lat, rotation,
                    crs_epsg, cell_size, nrows, ncols)
grid_geo = results_grid.get_grid_geojson(properties)

# %% [markdown]
# Convert to string format

# %%
grid_geo_str = json.dumps(grid_geo)


# %%
f = open("results.json", "w+")
f.write(grid_geo_str)
f.close()


# %%
