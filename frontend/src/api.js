// src/api.js
import axios from "axios";

const RAW_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const BASE_URL = `${RAW_BASE}/api`;

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

export const deleteProject = (token, id) =>
  axios.delete(`${BASE_URL}/projects/${id}`, {
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

export const updateTask = (token, id, data) =>
  axios.put(`${BASE_URL}/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = (token, id) =>
  axios.delete(`${BASE_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
