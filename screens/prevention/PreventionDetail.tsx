import React from 'react';
import { Text, StyleSheet, Image, Platform } from 'react-native';
import { PreventionStackNavProps } from './types';
import { ScrollView } from 'react-native-gesture-handler';
import { SharedElement } from 'react-navigation-shared-element';

export default function PreventionDetail({
  route,
}: PreventionStackNavProps<'PreventionDetail'>) {
  const {
    item: { id, image, longText, title },
  } = route.params;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {Platform.OS === 'web' ? (
        <Image source={image} style={styles.image} resizeMode="cover" />
      ) : (
        <SharedElement id={id}>
          <Image source={image} style={styles.image} resizeMode="cover" />
        </SharedElement>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{longText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
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
