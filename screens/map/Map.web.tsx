// @ts-nocheck
import React from 'react';
import { View } from 'react-native';
import GoogleMapReact from 'google-map-react';

import { useLocation } from '../../hooks/use-location';

// const heatmapData = {
//   positions: [
//     {
//       lat: -34.612146,
//       lng: -58.384734,
//       weight: 80,
//     },
//     {
//       lat: -34.609858,
//       lng: -58.384788,
//       weight: 100,
//     },
//     {
//       lat: -34.604476,
//       lng: -58.374188,
//       weight: 60,
//     },
//   ],
//   options: {
//     radius: 20,
//     opacity: 0.7,
//   },
// };

const DEFAULT_LOCATION = {
  center: {
    lat: -38.00578,
    lng: -63.479311,
  },
  zoom: 5,
};

export default function Map({ navigation }) {
  const { location } = useLocation();

  const coords = location
    ? {
        center: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        zoom: 15,
      }
    : DEFAULT_LOCATION;

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
        heatmapLibrary
        // heatmap={heatmapData}
        options={{ fullscreenControl: false, zoomControl: false }}
      />
    </View>
  );
}
