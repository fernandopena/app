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
  DEFAULT_LOCATION_WEB,
} from './mapConfig';

export default function Map({ navigation }) {
  // const heatmapData = {
  //   mapData: {
  //     positions: [
  //       {
  //         lat: -34.612146,
  //         lng: -58.384734,
  //         weight: 80,
  //       },
  //       {
  //         lat: -34.609858,
  //         lng: -58.384788,
  //         weight: 100,
  //       },
  //       {
  //         lat: -34.604476,
  //         lng: -58.374188,
  //         weight: 60,
  //       },
  //     ],
  //     options: {
  //       radius: 20,
  //       opacity: 0.7,
  //     },
  //   },
  // };

  // const coords = {
  //   center: {
  //     lat: -34.609858,
  //     lng: -58.384788,
  //   },
  //   zoom: HEATMAP_WEB_ZOOM,
  // };

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
      const locationCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      if (shouldUpdateHeatMap(heatmapData, locationCoords)) {
        getHeatmapData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE,
        })
          .then(response => {
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
              center: locationCoords,
            };
            setHeatmapData(heatmapData);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }, [location]);

  const MyPosition = () => (
    <div
      style={{
        backgroundColor: 'rgba(66, 135, 244, 1)',
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        height: 15,
        width: 15,
      }}
    ></div>
  );

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      {heatmapData.mapData ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyBQpsPCu044OtdS91bu-2hdNQaeY_8wjFw',
          }}
          center={coords.center}
          zoom={coords.zoom}
          heatmapLibrary={true}
          heatmap={heatmapData.mapData}
          options={{ fullscreenControl: false, zoomControl: false }}
        >
          {location ? (
            <MyPosition
              lat={location.coords.latitude}
              lng={location.coords.longitude}
            />
          ) : null}
        </GoogleMapReact>
      ) : null}
    </View>
  );
}
