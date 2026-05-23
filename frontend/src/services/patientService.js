import api, { unwrapApiResponse } from './api';

const sanitizePatientPayload = (payload = {}) => ({
	firstName: payload.firstName?.trim(),
	lastName: payload.lastName?.trim(),
	gender: payload.gender,
	dateOfBirth: payload.dateOfBirth,
	email: payload.email?.trim(),
	phoneNumber: payload.phoneNumber?.trim(),
	address: payload.address?.trim(),
	bloodGroup: payload.bloodGroup || null,
	emergencyContactName: payload.emergencyContactName?.trim() || null,
	emergencyContactPhone: payload.emergencyContactPhone?.trim() || null,
});

const requestData = async (request) => unwrapApiResponse(await request);

export const getAllPatients = async () => requestData(api.get('/api/patients'));
export const getPatients = getAllPatients;
export const searchPatients = async (name) => requestData(api.get('/api/patients/search', { params: { name } }));
export const getPatientById = async (id) => requestData(api.get(`/api/patients/${id}`));
export const createPatient = async (payload) => requestData(api.post('/api/patients', sanitizePatientPayload(payload)));
export const updatePatient = async (id, payload) => requestData(api.put(`/api/patients/${id}`, sanitizePatientPayload(payload)));
export const deletePatient = async (id) => requestData(api.delete(`/api/patients/${id}`));
