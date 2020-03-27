/** ***************************
* environment.js
* https://alxmrtnz.com/thoughts/2019/03/12/environment-variables-and-workflow-in-expo.html
* path: 'src/api/environment.js' (root of your project)
***************************** */
import Constants from 'expo-constants';

const baseURLDev = 'https://l1idp9celd.execute-api.us-east-2.amazonaws.com/dev/';
const baseURLProd = 'https://l1idp9celd.execute-api.us-east-2.amazonaws.com/prod/';

const ENV = {
  dev: {
    apiUrl: baseURLDev,
  },
  prod: {
    apiUrl: baseURLProd,
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } if (env === 'prod') {
    return ENV.prod;
  }
  return ENV.dev;//If no channel is specified point to dev by default
};

export default getEnvVars;
