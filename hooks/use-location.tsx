import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { LocationData } from 'expo-location';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';

import { locationService } from '../utils/locationService';

const LOCATION_TASK_NAME = 'background-location-task';

if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.log('error', error);
      // check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data as any;
      const [location] = locations;
      locationService.setLocation(location);
    }
  });
}

export const useLocation = (
  {
    runInBackground,
  }: {
    runInBackground?: Boolean;
  } = { runInBackground: false },
) => {
  const [location, setLocation] = useState<LocationData | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function getLocationAsync() {
      let { status, ios } = await Location.requestPermissionsAsync();
      let {
        permissions: { location },
      } = await Permissions.askAsync(Permissions.LOCATION);
      console.log('getLocationAsync -> location', location);

      console.log('getLocationAsync -> status, ios', status, ios);
      if (status !== 'granted') {
        setError('El permiso para acceder a la ubicación fue denegado');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        try {
          if (
            runInBackground &&
            (Platform.OS !== 'ios' ||
              (Platform.OS === 'ios' && ios.scope === 'always'))
          ) {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
              accuracy: Location.Accuracy.Balanced,
              distanceInterval: 100,
              //   deferredUpdatesDistance: 100
              // deferredUpdatesInterval: 10000
            });
          }
        } catch (e) {
          console.log('getLocationAsync -> e', e);
          setError('Ups, error al intentar obtener ubicación');
        }
      }
    }

    getLocationAsync();

    return async () => {
      if (runInBackground) {
        if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
          // console.log('stopLocationUpdatesAsync');
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    };
  }, []);

  useEffect(() => {
    function onLocationUpdate(location) {
      // TODO: save location locally
    }

    locationService.subscribe(onLocationUpdate);
    return () => {
      locationService.unsubscribe(onLocationUpdate);
    };
  }, []);

  return { location, error };
};
