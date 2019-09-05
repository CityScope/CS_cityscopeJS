
# %%

import os
import sys

file_dir = os.path.dirname('grid_geojson')  # nopep8
sys.path.append(file_dir)  # nopep8
import json

from grid_geojson import *

# %% [markdown]
# Specify the properties of the grid

# %%


top_left_lat = 53.53811
top_left_lon = 10.00630
rotation = 145.5
nrows = 44
ncols = 78

cell_size = 16
properties = {'usage': [0 for i in range(nrows*ncols)],
              'height': [1 for i in range(nrows*ncols)],
              'pop_density': [2 for i in range(nrows*ncols)]}
crs_epsg = '31468'

# %% [markdown]
# Compute the geojson as a dict

# %%
grasbrook_grid = Grid(top_left_lon, top_left_lat, rotation,
                      crs_epsg, cell_size, nrows, ncols)
grid_geo = grasbrook_grid.get_grid_geojson(properties)

# %% [markdown]
# Convert to string format

# %%
grid_geo_str = json.dumps(grid_geo)


# %%
f = open("results.geojson", "w+")
f.write(grid_geo_str)
f.close()
# print(grid_geo_str)


# %%
