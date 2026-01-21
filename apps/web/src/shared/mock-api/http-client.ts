import axios from 'axios';

import { API_CONFIG } from '../config/api';
import { transformError } from './error-handler';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL,
  timeout: API_CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(transformError(error));
    }
    return Promise.reject(error);
  },
);
