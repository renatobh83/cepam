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

export const salaDelete = (id) => {
  headerDefaults();
  return instance.delete(`/salas/${id}`);
};
// API procediementos
export const getProcedimentos = () => {
  headerDefaults();
  return instance.get('/procedimentos');
};
export const postProcedimento = (data) => {
  headerDefaults();
  return instance.post('/procedimentos', data);
};
export const putProcedimento = (id, data) => {
  headerDefaults();
  return instance.put(`/procedimentos/${id}`, data);
};

export const procedimentoApagar = (id) => {
  headerDefaults();
  return instance.delete(`/procedimentos/${id}`);
};
// API tabelas
export const getTabelas = () => {
  headerDefaults();
  return instance.get('/tabelas');
};
export const postTabelas = (data) => {
  headerDefaults();
  return instance.post('/tabelas', data);
};
export const putTabelas = (id, data) => {
  headerDefaults();
  return instance.put(`/tabelas/${id}`, data);
};
export const putNomeTabela = (id, data) => {
  headerDefaults();
  return instance.put(`/tabelas/name/${id}`, data);
};
export const procedimentoTabela = () => {
  headerDefaults();
  return instance.get('/procedimentos/tabela');
};
export const tabelaApagar = (id) => {
  headerDefaults();
  return instance.delete(`/tabelas/excluir/${id}`);
};
export const excluirExame = (id) => {
  headerDefaults();
  return instance.delete(`/tabelas/${id}`);
};
// API planos
export const getPlanos = () => {
  headerDefaults();
  return instance.get('/planos');
};
export const postPlanos = (data) => {
  headerDefaults();
  return instance.post('/planos', data);
};
export const putPlanos = (id, data) => {
  headerDefaults();
  return instance.put(`/planos/${id}`, data);
};

export const planosApagar = (id) => {
  headerDefaults();
  return instance.delete(`/planos/${id}`);
};
