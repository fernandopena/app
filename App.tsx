import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import useLinking from './navigation/useLinking';
import {
  getPreferences,
  SQLITE_DB_NAME,
  SQLITE_DB_VERSION,
  UserPreferences,
  // clearPreferences,
} from './utils/config';
import MainNavigator from './navigation/MainNavigator';
import Layout from './constants/Layout';

const isWeb = Platform.OS === 'web';
const db = !isWeb && SQLite.openDatabase(SQLITE_DB_NAME);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // const [showOnboarding, setShowOnboarding] = React.useState(true);
  const [preferences, setPreferences] = React.useState<
    UserPreferences | undefined
  >();
  const [initialNavigationState, setInitialNavigationState] = React.useState<
    any
  >();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        if (!isWeb) {
          //Create DB Tables
          db.transaction(
            tx => {
              // tx.executeSql('drop table diagnostics');
              tx.executeSql(
                'create table if not exists diagnostics (id integer primary key not null, answers text, result text, location text, created_at int);',
              );
              tx.executeSql(
                'create table if not exists locations (id integer primary key not null, location text, created_at int);',
              );
              // Query user_version and compare to actual in case of migration is needed
              // tx.executeSql(
              //   'select * from pragma_user_version',
              //   [],
              //   (_, { rows }) => console.log(rows),
              // );
            },
            (error: SQLError) =>
              console.log('Error in transaction', error.message),
            () => {
              console.log('Create tables success');
            },
          );
          // Set the user_version for future migrations purposes
          db.exec(
            [{ sql: `PRAGMA user_version = ${SQLITE_DB_VERSION};`, args: [] }],
            false,
            (error, rs) => {
              // console.log('user_version', error, rs);
            },
          );
        }

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });

        const preventionImages = [
          require('./assets/images/logo.png'),
          require('./assets/images/prevention/coronavirus.png'),
          require('./assets/images/prevention/fever.png'),
          require('./assets/images/prevention/spread.png'),
          require('./assets/images/prevention/transmission.png'),
          require('./assets/images/prevention/hygiene.png'),
          require('./assets/images/prevention/travel.png'),
          require('./assets/images/prevention/quarantine.png'),
          require('./assets/images/prevention/washing.png'),
          require('./assets/images/prevention/warning.png'),
        ];

        const cacheImages = preventionImages.map(image => {
          return Asset.fromModule(image).downloadAsync();
        });

        await Promise.all(cacheImages);

        // await clearPreferences();
        const preferences = await getPreferences();
        setPreferences(preferences);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}

        <NavigationContainer
          ref={containerRef}
          initialState={initialNavigationState}
        >
          <MainNavigator {...preferences} />
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        maxWidth: Layout.maxWidth,
        margin: 'auto',
        width: '100%',
      },
    }),
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(0,0,0,0.9)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '200',
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
});
