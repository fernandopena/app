import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PreventionStackNavProps } from './types';
import { ScrollView } from 'react-native-gesture-handler';

export default function PreventionDetail({
  route,
}: PreventionStackNavProps<'PreventionDetail'>) {
  const {
    item: { image, longText, title },
  } = route.params;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{longText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '200',
  },
});
