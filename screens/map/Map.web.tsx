// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import GoogleMapReact from 'google-map-react';
import { getHeatmapData } from '../../api/services';

import { useLocation } from '../../hooks/use-location';

import { 
  shouldUpdateHeatMap, 
  HEATMAP_WEB_ZOOM, 
  HEATMAP_WEB_RADIUS, 
  HEATMAP_WEB_OPACITY, 
  HEATMAP_GET_DATA_DISTANCE,
  DEFAULT_LOCATION_WEB
 } from './mapConfig';


export default function Map({ navigation }) {
  const [heatmapData, setHeatmapData] = useState({});
  const { location } = useLocation();
  const coords = location
    ? {
        center: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        zoom: HEATMAP_WEB_ZOOM,
      }
    : DEFAULT_LOCATION_WEB;


  useEffect(() => {
    if (location) {
      const locationCoords = {lat: location.coords.latitude, lng: location.coords.longitude};
      if (shouldUpdateHeatMap(heatmapData, locationCoords)) {
        getHeatmapData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE
        }).then((response)=>{
          const positions = response.data;
          const mapData = {
            positions: positions,
            options: {
              radius: HEATMAP_WEB_RADIUS,
              opacity: HEATMAP_WEB_OPACITY,
            },
          };
          const now = new Date().getTime();
          const heatmapData = {
            mapData: mapData,
            lastUpdated: now,
            center: locationCoords
          };
          setHeatmapData(heatmapData);
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }, [location]);

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyCo1C2fYnLT6q27QiAVBssaGTu9PMY5OIE',
        }}
        // defaultCenter={coords.center}
        // defaultZoom={coords.zoom}
        center={coords.center}
        zoom={coords.zoom}
        heatmapLibrary={true}
        heatmap={heatmapData.mapData}
        options={{ fullscreenControl: false, zoomControl: false }}
      />
    </View>
  );
}
