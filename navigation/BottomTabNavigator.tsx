import * as React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';

import TabBarIcon from '../components/TabBarIcon';
import Diagnostic from '../screens/diagnostic/Diagnostic';
import MapStack from '../screens/map/MapStack';
import Prevention from '../screens/prevention/Prevention';
import PreventionDetail from '../screens/prevention/PreventionDetail';
import Colors from '../constants/Colors';
import { PreventionParamsList } from '../screens/prevention/types';
import Results from '../screens/diagnostic/Results';

const INITIAL_ROUTE_NAME = 'Map';
const isIOS = Platform.OS === 'ios';

type TabsParamsList = {
  Diagnostic: undefined;
  Map: undefined;
  Prevention: undefined;
};

const Tab = createBottomTabNavigator<TabsParamsList>();

const DiagnosticStack = createStackNavigator();

const defaultScreenOptions = {
  headerTintColor: Colors.secondaryTextColor,
  headerStyle: { backgroundColor: Colors.primaryColor },
};

const PreventionStack = createStackNavigator<PreventionParamsList>();

function PreventionNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
    }, []),
  );
  return (
    <PreventionStack.Navigator screenOptions={defaultScreenOptions}>
      <PreventionStack.Screen
        name="Prevention"
        component={Prevention}
        options={{ headerTitle: 'Prevención' }}
      />
      <PreventionStack.Screen
        name="PreventionDetail"
        component={PreventionDetail}
        options={{ headerTitle: '' }}
      />
    </PreventionStack.Navigator>
  );
}

function DiagnosticModalNavStack() {
  return (
    <DiagnosticStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
      headerMode="none"
    >
      <DiagnosticStack.Screen
        name="Diagnostic"
        component={DiagnosticNavStack}
      />
      <DiagnosticStack.Screen name="DiagnosticResults" component={Results} />
    </DiagnosticStack.Navigator>
  );
}

function DiagnosticNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
    }, []),
  );
  return (
    <DiagnosticStack.Navigator screenOptions={defaultScreenOptions}>
      <DiagnosticStack.Screen
        name="Diagnostic"
        component={Diagnostic}
        options={{ headerTitle: 'Auto Diagnóstico' }}
      />
    </DiagnosticStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      // tabBar={TabBarComponent}
      tabBarOptions={{ showLabel: false }}
    >
      <Tab.Screen
        name="Diagnostic"
        component={DiagnosticModalNavStack}
        options={{
          title: 'Diagnóstico',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-medkit' : 'md-medkit'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={isIOS ? 'ios-map' : 'md-map'} />
          ),
          // tabBarVisible: false,
        }}
        component={MapStack}
      />
      <Tab.Screen
        name="Prevention"
        options={{
          title: 'Prevención',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-medical' : 'md-medical'}
            />
          ),
        }}
        component={PreventionNavStack}
      />
      {/* <Tab.Screen
        name="Data"
        options={{
          title: 'Datos',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-archive' : 'md-archive'}
            />
          ),
        }}
        component={Diagnostic}
      /> */}
    </Tab.Navigator>
  );
}
