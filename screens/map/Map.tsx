import React, { useRef, useState } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';

import { locationService } from '../../utils/locationService';
import { useLocation } from '../../hooks/use-location';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Default location is Argentina's coords
const DEFAULT_LOCATION = {
  latitude: -38.00578,
  longitude: -63.479311,
};

function PanelContent() {
  return (
    <View style={panelStyles.panel}>
      <View style={{ paddingBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={panelStyles.panelTitle}>RECOPILANDO INFORMACIÓN</Text>
        </View>
        <Text style={panelStyles.panelSubtitle}>
          La aplicación se irá actualizando con los datos de ubicación y
          recorridos de personas confirmadas con el contagio
        </Text>
      </View>
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
    fontSize: 20,
    paddingBottom: 10,
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
  const { location, error } = useLocation({ runInBackground: true });
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<MapView>();
  const refRBSheet = useRef();

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        loadingEnabled
        initialRegion={
          location
            ? {
                ...location.coords,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : undefined
        }
        initialCamera={{
          center: DEFAULT_LOCATION,
          pitch: 1,
          heading: 1,
          altitude: 11,
          zoom: 4,
        }}
        style={styles.map}
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
      />
      <SafeAreaView style={[styles.buttonContainer]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.locationButton]}
          onPress={() => navigation.navigate('Help')}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-help-circle-outline`}
            size={24}
            color="rgba(66,135,244,1)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.infoButton]}
          disabled={!location}
          onPress={() =>
            mapRef.current.animateToRegion({
              ...location.coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            })
          }
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-locate`}
            size={24}
            color={!location ? Colors.tabIconDefault : 'rgba(66, 135, 244, 1)'}
          />
        </TouchableOpacity>
      </SafeAreaView>
      {mapReady && (
        <BottomSheet
          ref={refRBSheet}
          snapPoints={['40%', 150, 50]}
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
