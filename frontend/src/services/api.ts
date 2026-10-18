import axios from 'axios';
import type { Complaint, Facility, Inspection } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getFacilities = async (params?: Record<string, string>) => {
  const response = await api.get('/facilities', { params });
  return response.data.data as Facility[];
};

export const createFacility = async (payload: Partial<Facility>) => {
  const response = await api.post('/facilities', payload);
  return response.data;
};

export const updateFacility = async (id: number, payload: Partial<Facility>) => {
  const response = await api.patch(`/facilities/${id}`, payload);
  return response.data;
};

export const deleteFacility = async (id: number) => {
  const response = await api.delete(`/facilities/${id}`);
  return response.data;
};

export const getInspections = async (params?: Record<string, string>) => {
  const response = await api.get('/inspections', { params });
  return response.data.data as Inspection[];
};

export const createInspection = async (payload: Partial<Inspection>) => {
  const response = await api.post('/inspections', payload);
  return response.data;
};

export const updateInspection = async (id: number, payload: Partial<Inspection>) => {
  const response = await api.patch(`/inspections/${id}`, payload);
  return response.data;
};

export const deleteInspection = async (id: number) => {
  const response = await api.delete(`/inspections/${id}`);
  return response.data;
};

export const getComplaints = async (params?: Record<string, string>) => {
  const response = await api.get('/complaints', { params });
  return response.data.data as Complaint[];
};

export const createComplaint = async (payload: Partial<Complaint>) => {
  const response = await api.post('/complaints', payload);
  return response.data;
};

export const updateComplaint = async (id: number, payload: Partial<Complaint>) => {
  const response = await api.patch(`/complaints/${id}`, payload);
  return response.data;
};

export const deleteComplaint = async (id: number) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

export default api;
