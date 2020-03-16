import * as React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';

import useLinking from './navigation/useLinking';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { getPreferences, savePreferences } from './utils/config';

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text:
      'CoTrack necesita saber tu ubicación para avisarte en tiempo real si en tu recorrido estuviste en contacto cercano con alguna persona contagiada',
    image: require('./assets/images/prevention/spread.png'),
    backgroundColor: '#e1bb3f',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text:
      'Si presentás síntomas o creés haber estado en contacto con alguien infectado, CoTrack te puede ayudar a realizar un diagnóstico y aconsejarte qué hacer según el resultado',
    image: require('./assets/images/prevention/fever.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun3',
    title: 'Rocket guy',
    text:
      'CoTrack te brinda información completa y confiable para ayudar a prevenir la infección, medidas para resguardarse e información útil y actualizada',
    image: require('./assets/images/prevention/washing.png'),
    backgroundColor: '#22bcb5',
  },
  {
    key: 'somethun4',
    title: 'Rocket guy',
    text:
      'CoTrack no envía datos privados ni requiere que te identifiques, tan sólo saber tu ubicación, la cual también podés decidir si compartirla o no en caso de contagio',
    image: require('./assets/images/prevention/warning.png'),
    backgroundColor: '#bb6767',
  },
];

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
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

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });

        const preventionImages = [
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

        const preferences = await getPreferences();
        setShowOnboarding(preferences.showOnboarding);
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

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        {/* <Text style={styles.title}>{item.title}</Text> */}
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = async () => {
    await savePreferences({ showOnboarding: false });
    setShowOnboarding(false);
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {showOnboarding ? (
          <AppIntroSlider
            nextLabel="Siguiente"
            prevLabel="Anterior"
            doneLabel="Finalizar"
            renderItem={renderItem}
            slides={slides}
            onDone={onDone}
          />
        ) : (
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <BottomTabNavigator />
          </NavigationContainer>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
});
