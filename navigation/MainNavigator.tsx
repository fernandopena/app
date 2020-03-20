import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { OnboardingSlides } from '../screens/onboaring/OnboardingSlides';

export type RootStackParamList = {
  Root: undefined;
  Help: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
      headerMode="none"
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="Help" component={OnboardingSlides} />
    </Stack.Navigator>
  );
}
