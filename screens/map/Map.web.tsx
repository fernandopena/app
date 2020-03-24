// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import GoogleMapReact from 'google-map-react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
// import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';

// import { useLocation } from '../../hooks/use-location';

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
  lat: -38.00578,
  lng: -63.479311,
};

export default function Map({ navigation }) {
  //   const { location, error } = useLocation();
  console.log('Map -> location', location);

  const [error, setError] = useState();
  const [location, setLocation] = useState();

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        setError('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({ location });
    };
    getLocationAsync();
  }, []);

  const coords = {
    center: location
      ? {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }
      : DEFAULT_LOCATION,
    zoom: 3,
  };

  let text = 'Waiting..';
  if (error) {
    text = error;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      <Text>{text}</Text>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyCFYmqvc4sq-IKD57ckeHxwjPWemDBytCY',
        }}
        defaultCenter={coords.center}
        defaultZoom={coords.zoom}
        heatmapLibrary
        // heatmap={heatmapData}
        options={{ fullscreenControl: false, zoomControl: false }}
      />
      {/* <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        showsUserLocation
        loadingEnabled
        // initialRegion={
        //   location
        //     ? {
        //         ...location.coords,
        //         latitudeDelta: LATITUDE_DELTA,
        //         longitudeDelta: LONGITUDE_DELTA,
        //       }
        //     : undefined
        // }
        initialCamera={{
          center: DEFAULT_LOCATION,
          pitch: 1,
          heading: 1,
          altitude: 11,
          zoom: 4,
        }}
        style={styles.map}
        // showsMyLocationButton={false}
        // onMapReady={() => setMapReady(true)}
      /> */}
    </View>
  );
}
