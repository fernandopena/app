import { axiosInstance } from './axiosInstance';

import {
  recordsRoute, locationsRoute, heatMapRoute
} from './routes';

export const postRecords = (reqData)  => {
  return axiosInstance.post(recordsRoute, reqData);
};