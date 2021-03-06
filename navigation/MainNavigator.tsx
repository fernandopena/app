import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import { OnboardingSlides } from '../screens/onboaring/OnboardingSlides';
import UserInfo from '../screens/user/UserInfo';
import { MainStackParamList } from './types';
import { UserPreferences } from '../utils/config';

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator({
  showOnboarding,
  userInfo,
}: UserPreferences) {
  const initialRouteName = showOnboarding
    ? 'Help'
    : userInfo && userInfo.province
    ? 'Main'
    : 'UserInfo';

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
      headerMode="none"
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Help" component={OnboardingSlides} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
    </Stack.Navigator>
  );
}
