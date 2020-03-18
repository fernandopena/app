import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type PreventionItem = {
  id: string;
  title: string;
  shortText: string;
  longText: string;
  image: any;
};

export type PreventionParamsList = {
  Prevention: undefined;
  PreventionDetail: {
    item: PreventionItem;
  };
};

export type PreventionStackNavProps<T extends keyof PreventionParamsList> = {
  navigation: StackNavigationProp<PreventionParamsList, T>;
  route: RouteProp<PreventionParamsList, T>;
};
