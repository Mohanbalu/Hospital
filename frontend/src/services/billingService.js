import api, { unwrapApiResponse } from './api';

const sanitizeBillPayload = (payload = {}) => ({
  patientId: payload.patientId ? Number(payload.patientId) : null,
  appointmentId: payload.appointmentId ? Number(payload.appointmentId) : null,
  issueDate: payload.issueDate,
  dueDate: payload.dueDate,
  totalAmount: payload.totalAmount !== '' && payload.totalAmount !== null && payload.totalAmount !== undefined
    ? Number(payload.totalAmount)
    : null,
  status: payload.status,
});

const requestData = async (request) => unwrapApiResponse(await request);

export const getAllBills = async () => requestData(api.get('/api/bills'));
export const getBills = getAllBills;
export const getBillById = async (id) => requestData(api.get(`/api/bills/${id}`));
export const generateBill = async (payload) => requestData(api.post('/api/bills', sanitizeBillPayload(payload)));
export const updateBillPaymentStatus = async (id, payload) =>
  requestData(api.put(`/api/bills/payment/${id}`, sanitizeBillPayload(payload)));
