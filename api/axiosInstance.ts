import axios from 'axios';
import getEnvVars from './environment';

const { apiUrl } = getEnvVars();

export const axiosInstance = axios.create({
  baseURL: apiUrl,
});