import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const fetchClient = (): AxiosInstance => {
  const options: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let instance: AxiosInstance = axios.create(options);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization =  token ? `Basic ${token}` : '';
    return config;
  });

  return instance;
};

export default fetchClient();