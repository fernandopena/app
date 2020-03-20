import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
import MapView, {
  // PROVIDER_DEFAULT,
  // PROVIDER_GOOGLE,
  // MarkerAnimated,
  AnimatedRegion,
  Circle,
  PROVIDER_DEFAULT,
  // Heatmap,
  // PROVIDER_GOOGLE,
  // Heatmap,
} from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';

import { locationService } from '../../utils/locationService';
import { LocationData } from 'expo-location';
// import Animated from 'react-native-reanimated';
// import { getTabBarHeight } from '../components/TabBarComponent';
import { useSafeArea } from 'react-native-safe-area-context';

const LOCATION_TASK_NAME = 'background-location-task';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const OVERLAY_TOP_LEFT_COORDINATE = [35.68184060244454, 139.76531982421875];
// const OVERLAY_BOTTOM_RIGHT_COORDINATE = [35.679609609368576, 139.76806640625];

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log('error', error);
    // check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data as any;
    // console.log("locations", locations);
    const { latitude, longitude } = locations[0].coords;
    locationService.setLocation({
      latitude,
      longitude,
    });
  }
});

function PanelContent() {
  return (
    <View style={panelStyles.panel}>
      <View style={{ alignItems: 'center' }}>
        <Text style={panelStyles.panelTitle}>Cuidado</Text>
        <Icon name="ios-alert" size={50} color="#E50000" />
      </View>
      <Text style={panelStyles.panelSubtitle}>
        Encontramos registros de gente contagiada que circulo por tu area
      </Text>
      <Text style={panelStyles.panelTitle}></Text>
      <Text style={panelStyles.panelSubtitle}>
        CoTrack utiliza tu ubicación para cruzar información de lugares y
        trayectos donde hayas estado, con las ubicaciones aproximadas de otros
        usuarios contagiados de coronavirus dentro de los últimos 14 días.
        {`\n\n`}Las coordenadas y horarios de localización se guardan en tu
        teléfono celular de manera encriptada. No hay ningún tipo de
        identificación con la cual se relacione ni a vos ni a tu dispositivo
        móvil con los datos de ubicación.{`\n\n`}La información de personas
        infectadas es provista por entes gubernamentales y nadie más que un
        organismo de salud puede certificar el contagio efectivo. El organismo
        preguntará al paciente si acepta compartir su información de ubicación
        de los últimos 14 días con motivo de ayudar a prevenir el contagio a
        otros usuarios. Sin embargo el paciente podrá optar por no hacerlo.
      </Text>
    </View>
  );
}

function PanelHeader() {
  return (
    <View style={panelStyles.header}>
      <View style={panelStyles.panelHeader}>
        <View style={panelStyles.panelHandle} />
      </View>
    </View>
  );
}

const panelStyles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
});

export default function Map({ navigation }) {
  // navigation.setOptions({ tabBarVisible: false });
  const [error, setError] = useState<string | undefined>();
  const [location, setLocation] = useState<LocationData | undefined>();
  const [coords, setCoords] = useState<
    { latitude: number; longitude: number } | undefined
  >();

  const [coordinate] = useState(new AnimatedRegion());
  const mapRef = useRef<MapView>();
  const refRBSheet = useRef();

  const insets = useSafeArea();

  useEffect(() => {
    async function getLocationAsync() {
      let {
        status,
        permissions: {
          location: { ios },
        },
      } = await Permissions.askAsync(Permissions.LOCATION);
      // let { status, ios } = await Location.getPermissionsAsync();
      // console.log('getLocationAsync -> ios, status', ios, status);
      if (status !== 'granted') {
        setError('El permiso para acceder a la ubicación fue denegado');
      } else if (Platform.OS === 'ios' && ios.scope !== 'always') {
        setError(
          'El permiso para acceder a la ubicación en todo momento fue denegado',
        );
      } else {
        try {
          let location = await Location.getCurrentPositionAsync({});
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            // distanceInterval: 50
            // deferredUpdatesDistance: 1000
          });
          setLocation(location);
          const newCoordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // latitude: 40.710065,
            // longitude: -74.013714,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          coordinate.timing(newCoordinate).start();
        } catch (e) {
          console.log('getLocationAsync -> e', e);
          setError('Ups, error al intentar obtener ubicación');
        }
      }
    }

    function onLocationUpdate({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) {
      const newCoordinate = {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setCoords({ latitude, longitude });

      coordinate.timing(newCoordinate).start();
    }

    getLocationAsync();

    locationService.subscribe(onLocationUpdate);
    return async () => {
      console.log('stopLocationUpdatesAsync');
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  let text = 'Cargando..';
  if (error) {
    text = error;
  } else if (coords) {
    text = JSON.stringify(coords);
  }

  return (
    <View style={[styles.container]}>
      {location && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          showsUserLocation
          // followsUserLocation
          initialRegion={{
            ...location.coords,
            // latitude: 40.710065,
            // longitude: -74.013714,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={styles.map}
          showsMyLocationButton={false}
        >
          <Circle
            center={location.coords}
            radius={700}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0, 200, 0, 0.5)"
            zIndex={2}
            strokeWidth={1}
          />
          <Circle
            center={{
              latitude: 40.721264,
              longitude: -73.99923,
            }}
            radius={600}
            fillColor="#EEC20BAA"
            strokeColor="#EEC20BAA"
            // zIndex={2}
            strokeWidth={1}
          />
          <Circle
            center={{
              latitude: 40.711631,
              longitude: -73.99923,
            }}
            radius={600}
            fillColor="#BBCF4CAA"
            strokeColor="#BBCF4CAA"
            // zIndex={2}
            strokeWidth={1}
          />
          <Circle
            center={{
              latitude: 40.713735,
              longitude: -73.994234,
            }}
            radius={400}
            fillColor="#EEC20BAA"
            strokeColor="#EEC20BAA"
            // zIndex={2}
            strokeWidth={1}
          />
          <Circle
            center={{
              latitude: 40.729301,
              longitude: -73.996745,
            }}
            radius={700}
            fillColor="rgba(255, 142, 0, 0.5)"
            strokeColor="rgba(255, 142, 0, 0.5)"
            // zIndex={2}
            strokeWidth={1}
          />
          {/* <Heatmap
            points={[
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                weight: 50,
              },
              {
                latitude: -34.612146,
                longitude: -58.384734,
                weight: 80,
              },
              {
                latitude: -34.609858,
                longitude: -58.384788,
                weight: 100,
              },
              {
                latitude: -34.604476,
                longitude: -58.374188,
                weight: 60,
              },
              // {
              //   latitude: 40.729301,
              //   longitude: -73.996745,
              //   weight: 90,
              // },
            ]}
            radius={Platform.OS === 'ios' ? 150 : 50}
            // opacity={0.7}
            gradient={{
              colors: ['#79BC6A', '#BBCF4C', '#EEC20B', '#F29305', '#E50000'],
              startPoints: [0.01, 0.25, 0.5, 0.75, 1],
              colorMapSize: 100,
            }}
          /> */}
          {/* <MarkerAnimated coordinate={coordinate} /> */}
        </MapView>
      )}
      <View style={[styles.buttonContainer, { paddingTop: insets.top }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.locationButton]}
          // onPress={() => navigation.navigate('MapInfo')}
          onPress={() => navigation.navigate('Help')}
        >
          <Icon
            // name="md-information-circle-outline"
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-help-circle-outline`}
            size={24}
            color="rgba(66,135,244,1)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.infoButton]}
          onPress={() =>
            mapRef.current.animateToRegion({
              ...location.coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            })
          }
        >
          <Icon name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-locate`} size={24} color="rgba(66,135,244,1)" />
        </TouchableOpacity>
      </View>
      {location && (
        <BottomSheet
          ref={refRBSheet}
          snapPoints={['40%', 50]}
          renderContent={PanelContent}
          renderHeader={PanelHeader}
          initialSnap={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    minWidth: 50,
  },
  locationButton: {
    marginTop: 12,
    marginBottom: StyleSheet.hairlineWidth,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  infoButton: {
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
