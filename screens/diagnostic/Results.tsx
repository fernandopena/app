import React from 'react';
import {
  Linking,
  Alert,
  Text,
  StyleSheet,
  Platform,
  View,
  StatusBar,
} from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DiagnosticStackNavProps } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

function PositiveResults() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={[styles.cardTitle, { color: '#79BC6A' }]}>SIN RIESGOS</Text>
      <Text style={styles.cardSubTitle}>
        Tus síntomas no parecen estar relacionados con el contagio de
        coronavirus.{`\n\n`}Te proponemos repasar el listado de medidas
        preventivas para evitar el contagio y a compartir con otros esta
        información.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.navigate('Prevention')}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Consejos para la prevención
        </Text>
      </RectButton>
      <Text style={styles.cardSubTitle}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autodiagnóstico y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}
function NeutralResults() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={[styles.cardTitle, { color: '#EEC20B' }]}>
        RIESGO MODERADO
      </Text>
      <Text style={styles.cardSubTitle}>
        Algunos de tus síntomas pueden estar asociados al contagio de
        coronavirus pero no son concluyentes para determinar si efectivamente
        estás infectado.{`\n\n`}Te proponemos repasar el listado de medidas
        preventivas para evitar el contagio y a compartir con otros esta
        información.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.navigate('Prevention')}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Consejos para la prevención
        </Text>
      </RectButton>
      <Text style={styles.cardSubTitle}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autodiagnóstico y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}

function NegativeResults() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={[styles.cardTitle, { color: '#E50000' }]}>RIESGO ALTO</Text>
      <Text style={styles.cardSubTitle}>
        Te aconsejamos consultar con un profesional de acuerdo a las
        indicaciones en tu ciudad.{`\n\n`}Acá podés conseguir ayuda para
        conseguir los números de organismos oficiales para que te orienten sobre
        cómo proceder y recibir asistencia médica y psicológica.
        {`\n\n`}Ministerio de Salud de la Nación:{`\n`}
      </Text>
      <Text
        style={{ color: '#007AFF' }}
        onPress={async () => {
          try {
            await Linking.openURL(`tel:0800-222-1002`);
          } catch (e) {
            Alert.alert('Error al intentar hacer la llamada');
          }
        }}
      >
        0800-222-1002 opción 1
      </Text>
      <Text style={styles.cardSubTitle}>
        Te proponemos repasar el listado de medidas preventivas para evitar el
        contagio y a compartir con otros esta información.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.navigate('Prevention')}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Consejos para la prevención
        </Text>
      </RectButton>
      <Text style={styles.cardSubTitle}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autodiagnóstico y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}

export default function Results({
  route,
}: DiagnosticStackNavProps<'DiagnosticResults'>) {
  const { results } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.secondaryTextColor);
    }, []),
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {results === 'positive' && <PositiveResults />}
          {results === 'neutral' && <NeutralResults />}
          {results === 'negative' && <NegativeResults />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardTitle: { fontSize: 22, padding: 20 },
  cardSubTitle: { fontSize: 14, paddingTop: 20, textAlign: 'center' },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: '#29C097',
  },
  activeButtonText: { color: '#fff' },
});
