import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationProp,
} from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { OnboardingSlides } from '../screens/onboaring/OnboardingSlides';
import { RouteProp } from '@react-navigation/native';

export type MainStackParamList = {
  Main: undefined;
  Help: undefined;
};
export type MainStackNavProps<T extends keyof MainStackParamList> = {
  navigation: StackNavigationProp<MainStackParamList, T>;
  route: RouteProp<MainStackParamList, T>;
};

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator({ showOnboarding }) {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
      headerMode="none"
      initialRouteName={showOnboarding ? 'Help' : 'Main'}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Help" component={OnboardingSlides} />
    </Stack.Navigator>
  );
}
