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

export const apagarGrupo = (id) => {
  headerDefaults();
  return instance.delete(`/grupos/${id}`);
};
export const putGrupo = (id, data) => {
  headerDefaults();
  return instance.put(`/grupos/${id}`, data);
};

// API SETORES
export const getSetores = () => {
  headerDefaults();
  return instance.get('/setores');
};
export const postSetores = (data) => {
  headerDefaults();
  return instance.post('/setores', data);
};

export const setorDelete = (id) => {
  headerDefaults();
  return instance.delete(`/setores/${id}`);
};
export const putSetores = (id, data) => {
  headerDefaults();
  return instance.put(`/setores/${id}`, data);
};
// API SALAS
export const getSalas = () => {
  headerDefaults();
  return instance.get('/salas');
};
export const postSala = (data) => {
  headerDefaults();
  return instance.post('/salas', data);
};

export const deleteSala = (id) => {
  headerDefaults();
  return instance.delete(`/salas/${id}`);
};
export const putSala = (id, data) => {
  headerDefaults();
  return instance.put(`/salas/${id}`, data);
};
