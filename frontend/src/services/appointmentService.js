import api, { unwrapApiResponse } from './api';

const sanitizeAppointmentPayload = (payload = {}) => ({
  patientId: payload.patientId ? Number(payload.patientId) : null,
  doctorId: payload.doctorId ? Number(payload.doctorId) : null,
  appointmentDateTime: payload.appointmentDateTime,
  reason: payload.reason?.trim(),
  notes: payload.notes?.trim() || null,
});

const requestData = async (request) => unwrapApiResponse(await request);

export const getAllAppointments = async () => requestData(api.get('/api/appointments'));
export const getAppointments = getAllAppointments;
export const getAppointmentById = async (id) => requestData(api.get(`/api/appointments/${id}`));
export const bookAppointment = async (payload) => requestData(api.post('/api/appointments', sanitizeAppointmentPayload(payload)));
export const rescheduleAppointment = async (id, payload) =>
  requestData(api.put(`/api/appointments/reschedule/${id}`, sanitizeAppointmentPayload(payload)));
export const cancelAppointment = async (id) => requestData(api.put(`/api/appointments/cancel/${id}`));
