import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { Notifications } from 'expo';

import useLinking from './navigation/useLinking';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import registerForPushNotificationsAsync from './utils/registerForPushNotificationsAsync';
import AppConstants from './constants/App';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState<
    any
  >();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [
    notificationSubscription,
    setNotificationSubscription,
  ] = React.useState(null);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    registerForPushNotificationsAsync();

    setNotificationSubscription(Notifications.addListener(_handleNotification));
    loadResourcesAndDataAsync();

    return () => {
      notificationSubscription && notificationSubscription.remove();
    };
  }, []);

  const _handleNotification = ({ data }) => {
    if (data.code && data.code === AppConstants.PUSH_NOTIFICATIONS.MAP_01) {
      Alert.alert(data.message);
    }
  };

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
          <BottomTabNavigator />
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
