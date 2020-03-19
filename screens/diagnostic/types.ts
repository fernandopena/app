import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type QuestResults = 'positive' | 'neutral' | 'negative';

export type DiagnosticParamsList = {
  Diagnostic: undefined;
  DiagnosticResults: {
    results: QuestResults;
  };
};

export type DiagnosticStackNavProps<T extends keyof DiagnosticParamsList> = {
  navigation: StackNavigationProp<DiagnosticParamsList, T>;
  route: RouteProp<DiagnosticParamsList, T>;
};
