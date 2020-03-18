import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { MapStackNavProps } from './MapStack';

const CIRCLE_WIDTH = 60;

export default function MapInfo({ navigation }: MapStackNavProps<'MapInfo'>) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, paddingTop: 70 }}>
        Información sobre el mapa
      </Text>
      <View style={styles.content}>
        <View style={styles.counterContainer}>
          <View style={[styles.circle, styles.positive]}>
            <Text style={styles.counter}>2763</Text>
          </View>
          <Text style={styles.text}>Recuperados</Text>
        </View>
        <View style={styles.counterContainer}>
          <View style={[styles.circle, styles.neutral]}>
            <Text style={styles.counter}>2763</Text>
          </View>
          <Text style={styles.text}>Casos detectados</Text>
        </View>
        <View style={styles.counterContainer}>
          <View style={[styles.circle, styles.negative]}>
            <Text style={styles.counter}>2763</Text>
          </View>
          <Text style={styles.text}>Fallecidos</Text>
        </View>
      </View>
      <Button onPress={() => navigation.goBack()} title="Cerrar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    // borderWidth: 1,
  },
  counterContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 1,
    padding: 20,
  },
  circle: {
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: CIRCLE_WIDTH / 2,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positive: {
    backgroundColor: '#79BC6A',
  },
  neutral: {
    backgroundColor: '#EEC20B',
  },
  negative: {
    backgroundColor: '#E50000',
  },
  counter: {
    color: '#FFF',
  },
  text: {
    fontSize: 18,
  },
});
