import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { LocationData } from 'expo-location';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
import * as SQLite from 'expo-sqlite';

import { locationService } from '../utils/locationService';
import { SQLITE_DB_NAME } from '../utils/config';

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
      // console.log('locations', locations);
      const [location] = locations;
      locationService.setLocation(location);
    }
  });
}

const isWeb = Platform.OS === 'web';
const db = !isWeb && SQLite.openDatabase(SQLITE_DB_NAME);

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
      if (status !== 'granted') {
        setError('El permiso para acceder a la ubicación fue denegado');
      } else {
        let location = await Location.getCurrentPositionAsync();
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
              // deferredUpdatesDistance: 10000,
              // deferredUpdatesInterval: 10000,
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
      // console.log('onLocationUpdate -> location', location);
      db.transaction(
        tx => {
          tx.executeSql(
            'insert into locations (location, created_at) values (?, strftime("%s","now"))',
            [JSON.stringify(location)],
          );
          // tx.executeSql('select * from locations', [], (_, { rows }) =>
          //   console.log(rows),
          // );
        },
        (error: SQLError) =>
          console.log('Error inserting values', error.message),
        () => {
          // console.log('Location saved!');
        },
      );
    }

    locationService.subscribe(onLocationUpdate);
    return () => {
      locationService.unsubscribe(onLocationUpdate);
    };
  }, []);

  return { location, error };
};
