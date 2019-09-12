#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul 29 18:57:59 2019

@author: doorleyr
"""
import pyproj
import math

def deg_to_rad(deg):
    return deg*math.pi/180

def rad_to_deg(rad):
    return rad*180/math.pi

class Grid():
    def __init__(self, top_left_lon, top_left_lat, rotation, crs_epsg, 
                 cell_size, nrows, ncols):
        """
        Takes the properties of the grid and using the Haversine formula, 
        computes the location of the top-right corner. Then projects
        to spatial coordinates in order to find the locations of the rest of 
        the grid cells
        """
        EARTH_RADIUS_M=6.371e6
        top_left_lon_lat={'lon': top_left_lon, 'lat': top_left_lat}
        bearing=(90-rotation+360)%360
        projection=pyproj.Proj("+init=EPSG:"+crs_epsg)
        wgs=pyproj.Proj("+init=EPSG:4326")
        cell_size=cell_size
        self.nrows=nrows
        self.ncols=ncols
        Ad=(cell_size*ncols)/EARTH_RADIUS_M
        la1=deg_to_rad(top_left_lon_lat['lat'])
        lo1=deg_to_rad(top_left_lon_lat['lon'])
        bearing_rad=deg_to_rad(bearing)
        la2= math.asin(math.sin(la1) * math.cos(Ad)  + 
                          math.cos(la1) * math.sin(Ad) * math.cos(bearing_rad))
        lo2= lo1+ math.atan2(math.sin(bearing_rad) * math.sin(Ad) * math.cos(la1),
                             math.cos(Ad)-math.sin(la1)*math.sin(la2))
        top_right_lon_lat={'lon': rad_to_deg(lo2), 'lat': rad_to_deg(la2)}        
        top_left_xy=pyproj.transform(wgs, projection,top_left_lon_lat['lon'], 
                                     top_left_lon_lat['lat'])
        top_right_xy=pyproj.transform(wgs, projection,top_right_lon_lat['lon'], 
                                      top_right_lon_lat['lat'])
        # now we have the top two points in a spatial system, 
        # we can calculate the rest of the points
        dydx=(top_right_xy[1]-top_left_xy[1])/(top_right_xy[0]-top_left_xy[0])
        theta=math.atan((dydx))
        cosTheta=math.cos(theta)
        sinTheta=math.sin(theta)
        x_unRot=[j*cell_size for i in range(nrows) for j in range(ncols)]
        y_unRot=[-i*cell_size for i in range(nrows) for j in range(ncols)]
        # use the rotation matrix to rotate around the origin
        x_rot=[x_unRot[i]*cosTheta -y_unRot[i]*sinTheta for i in range(len(x_unRot))]
        y_rot=[x_unRot[i]*sinTheta +y_unRot[i]*cosTheta for i in range(len(x_unRot))]
        x_rot_trans=[top_left_xy[0]+x_rot[i] for i in range(len(x_rot))]
        y_rot_trans=[top_left_xy[1]+y_rot[i] for i in range(len(x_rot))]
        lon_grid, lat_grid=pyproj.transform(projection,wgs,x_rot_trans, y_rot_trans)
        self.grid_coords_ll=[[lon_grid[i], lat_grid[i]] for i in range(len(lon_grid))]
        self.grid_coords_xy=[[x_rot_trans[i], y_rot_trans[i]] for i in range(len(y_rot_trans))]

    def get_grid_geojson(self, properties):
        """
        Takes the pre-computed locations of the top-left corner of every grid cell
        and creates a corresponding Multi-Polygon geojson object
        """
        delta_ll_across=[self.grid_coords_ll[1][0]-self.grid_coords_ll[0][0], 
                         self.grid_coords_ll[1][1]-self.grid_coords_ll[0][1]]
        delta_ll_down=[self.grid_coords_ll[self.ncols][0]-self.grid_coords_ll[0][0], 
                       self.grid_coords_ll[self.ncols][1]-self.grid_coords_ll[0][1]]
        features=[]
        for i, g in enumerate(self.grid_coords_ll):
            coords=[g, 
                    [g[0]+delta_ll_down[0], g[1]+delta_ll_down[1]],
                    [g[0]+delta_ll_across[0]+delta_ll_down[0], g[1]+
                     delta_ll_across[1]+delta_ll_down[1]],
                    [g[0]+delta_ll_across[0],g[1]+delta_ll_across[1]], 
                    g]
            features.append({'type': 'Feature',
                             'geometry':{'type': 'Polygon', 'coordinates': [coords]},
                             'properties': {p: properties[p][i] for p in properties}})
        geojson_object={'type': 'FeatureCollection',
                        'features': features}
        return geojson_object


