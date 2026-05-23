import api, { unwrapApiResponse } from './api';

export const getPatients = async () => unwrapApiResponse(await api.get('/api/patients'));
export const searchPatients = async (name) => unwrapApiResponse(await api.get('/api/patients/search', { params: { name } }));
export const getPatientById = async (id) => unwrapApiResponse(await api.get(`/api/patients/${id}`));
export const createPatient = async (payload) => unwrapApiResponse(await api.post('/api/patients', payload));
export const updatePatient = async (id, payload) => unwrapApiResponse(await api.put(`/api/patients/${id}`, payload));
export const deletePatient = async (id) => unwrapApiResponse(await api.delete(`/api/patients/${id}`));
