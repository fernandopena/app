import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MAX_WIDTH = 640;

export default {
  window: {
    width: Math.min(width, MAX_WIDTH),
    height,
  },
  maxWidth: MAX_WIDTH,
  isSmallDevice: width < 375,
};
