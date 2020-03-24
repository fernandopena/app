import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function HelpButton() {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Help')}>
      <Icon
        name="ios-help-circle-outline"
        size={30}
        color="#fff"
        // backgroundColor={Colors.primaryColor}
        style={{ paddingRight: 20 }}
      />
    </TouchableWithoutFeedback>
  );
}
