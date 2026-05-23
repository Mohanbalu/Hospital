import api, { unwrapApiResponse } from './api';

export const getAppointments = async () => unwrapApiResponse(await api.get('/api/appointments'));
export const getAppointmentById = async (id) => unwrapApiResponse(await api.get(`/api/appointments/${id}`));
export const bookAppointment = async (payload) => unwrapApiResponse(await api.post('/api/appointments', payload));
export const rescheduleAppointment = async (id, payload) =>
  unwrapApiResponse(await api.put(`/api/appointments/reschedule/${id}`, payload));
export const cancelAppointment = async (id) => unwrapApiResponse(await api.put(`/api/appointments/cancel/${id}`));
