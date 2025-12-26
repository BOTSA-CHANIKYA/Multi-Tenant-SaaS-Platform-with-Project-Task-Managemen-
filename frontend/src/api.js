import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api";

export const login = (email, password) =>
  axios.post(`${BASE_URL}/auth/login`, { email, password });

export const getProjects = (token) =>
  axios.get(`${BASE_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createProject = (token, data) =>
  axios.post(`${BASE_URL}/projects`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTasks = (token) =>
  axios.get(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (token, data) =>
  axios.post(`${BASE_URL}/tasks`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
