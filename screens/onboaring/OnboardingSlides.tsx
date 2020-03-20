import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StyleSheet, View, Image, Text } from 'react-native';
import { savePreferences } from '../../utils/config';
import { useNavigation } from '@react-navigation/native';

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text:
      'CoTrack necesita saber tu ubicación para avisarte en tiempo real si en tu recorrido estuviste en contacto cercano con alguna persona contagiada',
    image: require('../../assets/images/prevention/spread.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text:
      'Si presentás síntomas o creés haber estado en contacto con alguien infectado, CoTrack te puede ayudar a realizar un diagnóstico y aconsejarte qué hacer según el resultado',
    image: require('../../assets/images/prevention/fever.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'somethun3',
    title: 'Rocket guy',
    text:
      'CoTrack te brinda información completa y confiable para ayudar a prevenir la infección, medidas para resguardarse e información útil y actualizada',
    image: require('../../assets/images/prevention/washing.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'somethun4',
    title: 'Rocket guy',
    text:
      'CoTrack no envía datos privados ni requiere que te identifiques, tan sólo saber tu ubicación, la cual también podés decidir si compartirla o no en caso de contagio',
    image: require('../../assets/images/prevention/warning.png'),
    backgroundColor: '#fff',
  },
];

interface OnboardingSlidesProps {
  onDone?: () => void;
}

export const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({
  onDone,
}) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        {/* <Text style={styles.title}>{item.title}</Text> */}
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const handleDone = async () => {
    await savePreferences({ showOnboarding: false });
    onDone ? onDone() : navigation.goBack();
  };
  return (
    <AppIntroSlider
      nextLabel="Siguiente"
      prevLabel="Anterior"
      doneLabel="Finalizar"
      renderItem={renderItem}
      showPrevButton
      buttonTextStyle={{ color: '#59b2ab' }}
      activeDotStyle={{ backgroundColor: '#59b2ab' }}
      slides={slides}
      onDone={handleDone}
    />
  );
};

const styles = StyleSheet.create({
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
});
