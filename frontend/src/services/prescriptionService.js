import api, { unwrapApiResponse } from './api';

const sanitizePrescriptionPayload = (payload = {}) => ({
  appointmentId: payload.appointmentId ? Number(payload.appointmentId) : null,
  diagnosis: payload.diagnosis?.trim(),
  medication: payload.medication?.trim(),
  dosage: payload.dosage?.trim(),
  instructions: payload.instructions?.trim() || null,
  prescribedAt: payload.prescribedAt,
});

const requestData = async (request) => unwrapApiResponse(await request);

export const createPrescription = async (payload) => requestData(api.post('/api/prescriptions', sanitizePrescriptionPayload(payload)));

export const getPrescriptionsByPatient = async (patientId) => requestData(api.get(`/api/prescriptions/patient/${patientId}`));

export const getPrescriptionByAppointment = async (appointmentId) =>
  requestData(api.get(`/api/prescriptions/appointment/${appointmentId}`));