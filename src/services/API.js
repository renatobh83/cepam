import axios from 'axios';

import { getToken } from '../utils/LoginToken';
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const headerDefaults = () => {
  instance.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';
  instance.defaults.headers.common['withCredentials'] = true;
  instance.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
};

// Api login

export const loginGetUserDate = () => {
  headerDefaults();
  const response = instance.get('/usuarios/login');
  return response;
};

// API Users

export const getUsers = () => {
  headerDefaults();
  return instance.get('/usuarios');
};
export const postUser = (data) => {
  headerDefaults();
  return instance.post('/usuarios/', data);
};

export const putUser = (email, data) => {
  headerDefaults();
  return instance.put(`/usuarios/${email}`, data);
};
// API grupos
export const getGrupos = () => {
  headerDefaults();
  return instance.get('/grupos');
};
export const postGrupo = (data) => {
  headerDefaults();
  return instance.post('/grupos', data);
};
