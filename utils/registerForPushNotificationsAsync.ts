import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';


const registerForPushNotificationsAsync = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      // only asks if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      // On Android, permissions are granted on app installation, so
      // `askAsync` will never prompt the user

      // Stop here if the user did not grant permissions
      if (status !== 'granted') {
        Alert.alert('No notification permissions!');
        return;
      }


      // Get the token that identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.info('token', token)

    } catch (error) {
      console.error('error', error)
      alert('catch')
    }
  }

  export default registerForPushNotificationsAsync;