import api, { unwrapApiResponse } from './api';

export const getDoctors = async () => unwrapApiResponse(await api.get('/api/doctors'));
export const searchDoctorsBySpecialization = async (specialization) =>
  unwrapApiResponse(await api.get('/api/doctors/specialization', { params: { specialization } }));
export const getDoctorById = async (id) => unwrapApiResponse(await api.get(`/api/doctors/${id}`));
export const createDoctor = async (payload) => unwrapApiResponse(await api.post('/api/doctors', payload));
export const updateDoctor = async (id, payload) => unwrapApiResponse(await api.put(`/api/doctors/${id}`, payload));
export const deleteDoctor = async (id) => unwrapApiResponse(await api.delete(`/api/doctors/${id}`));
