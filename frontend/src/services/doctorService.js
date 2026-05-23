import api, { unwrapApiResponse } from './api';

const sanitizeDoctorPayload = (payload = {}) => ({
  departmentId: payload.departmentId ? Number(payload.departmentId) : null,
  firstName: payload.firstName?.trim(),
  lastName: payload.lastName?.trim(),
  email: payload.email?.trim(),
  phoneNumber: payload.phoneNumber?.trim(),
  licenseNumber: payload.licenseNumber?.trim(),
  specialization: payload.specialization?.trim(),
  yearsOfExperience: payload.yearsOfExperience ? Number(payload.yearsOfExperience) : null,
  consultationFee: payload.consultationFee !== '' && payload.consultationFee !== null && payload.consultationFee !== undefined
    ? Number(payload.consultationFee)
    : null,
});

const requestData = async (request) => unwrapApiResponse(await request);

export const getAllDoctors = async () => requestData(api.get('/api/doctors'));
export const getDoctors = getAllDoctors;
export const searchDoctorsBySpecialization = async (specialization) =>
  requestData(api.get('/api/doctors/specialization', { params: { specialization } }));
export const getDoctorById = async (id) => requestData(api.get(`/api/doctors/${id}`));
export const createDoctor = async (payload) => requestData(api.post('/api/doctors', sanitizeDoctorPayload(payload)));
export const updateDoctor = async (id, payload) => requestData(api.put(`/api/doctors/${id}`, sanitizeDoctorPayload(payload)));
export const deleteDoctor = async (id) => requestData(api.delete(`/api/doctors/${id}`));
