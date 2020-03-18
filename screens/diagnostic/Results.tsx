import React from 'react';
import {
  Linking,
  Alert,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { QuestResults } from './types';

const { height } = Dimensions.get('screen');

function PositiveResults({ onShowQuest }) {
  const navigation = useNavigation();
  return (
    <>
      <AntDesign name="smile-circle" size={50} color="#79BC6A" />
      <Text style={styles.cardTitle}>SIN RIESGOS</Text>
      <Text style={styles.cardSubTitle}>
        {`No contás con síntomas que puedan estar relacionados con el contagio de coronavirus, como así tampoco haber estado posiblemente expuesto a gente contagiada.\n\nTe proponemos repasar el listado de medidas preventivas para evitar el contagio y a compartir con otros esta información.`}
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
        {`Si tus síntomas fueron cambiando, por favor volvé a realizar el autodiagnóstico y seguí las recomendaciones dadas.`}
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={onShowQuest}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}
function NeutralResults({ onShowQuest }) {
  const navigation = useNavigation();
  return (
    <>
      <AntDesign name="meho" size={50} color="#EEC20B" />
      <Text style={styles.cardTitle}>RIESGO MODERADO</Text>
      <Text style={styles.cardSubTitle}>
        {`Algunos de tus síntomas pueden estar asociados al contagio de coronavirus pero no son concluyentes para determinar si efectivamente estás infectado.\n\nTe proponemos repasar el listado de medidas preventivas para evitar el contagio y a compartir con otros esta información.`}
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
        {`Si tus síntomas fueron cambiando, por favor volvé a realizar el autodiagnóstico y seguí las recomendaciones dadas.`}
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={onShowQuest}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}

function NegativeResults({ onShowQuest }) {
  const navigation = useNavigation();
  return (
    <>
      <AntDesign name="frown" size={50} color="#E50000" />
      <Text style={styles.cardTitle}>RIESGO ALTO</Text>
      <Text style={styles.cardSubTitle}>
        Es muy posible que te hayas contagiado de coronavirus.{`\n\n`}Podés
        llamar a alguno de los siguientes números de organismos oficiales para
        que te cuenten cómo proceder y recibir asistencia médica y psicológica:
        {`\n\n`}Ministerio de Salud en CABA: {`\n`}
      </Text>
      <Text
        style={{ color: '#007AFF' }}
        onPress={async () => {
          try {
            await Linking.openURL(`tel:148`);
          } catch (e) {
            Alert.alert('Error al intentar hacer la llamada');
          }
        }}
      >
        148
      </Text>
      <Text style={styles.cardSubTitle}>
        Ministerio de Salud en Argentina: {`\n`}
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
        0800-222-1002
      </Text>
      <Text style={styles.cardSubTitle}>
        opción 1{`\n\n`}Gobierno de la Ciudad de Buenos Aires:{`\n`}
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
        107
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
        {`Si tus síntomas fueron cambiando, por favor volvé a realizar el autodiagnóstico y seguí las recomendaciones dadas.`}
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={onShowQuest}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar diagnóstico nuevamente
        </Text>
      </RectButton>
    </>
  );
}

interface ResultsProps {
  onShowQuest: () => void;
  translateY: Animated.Value;
  results: QuestResults;
}

export const Results: React.FC<ResultsProps> = ({
  onShowQuest,
  translateY,
  results,
}) => {
  return (
    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
      <Animated.Text
        style={[
          styles.cardTitle,
          {
            opacity: translateY.interpolate({
              inputRange: [0, height],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        Resultado
      </Animated.Text>
      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        {results === 'positive' && (
          <PositiveResults onShowQuest={onShowQuest} />
        )}
        {results === 'neutral' && <NeutralResults onShowQuest={onShowQuest} />}
        {results === 'negative' && (
          <NegativeResults onShowQuest={onShowQuest} />
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cardTitle: { fontSize: 22, padding: 20 },
  cardSubTitle: { fontSize: 14, paddingTop: 20, textAlign: 'center' },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    width: '49%',
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
