import api, { unwrapApiResponse } from './api';

export const getBills = async () => unwrapApiResponse(await api.get('/api/bills'));
export const getBillById = async (id) => unwrapApiResponse(await api.get(`/api/bills/${id}`));
export const generateBill = async (payload) => unwrapApiResponse(await api.post('/api/bills', payload));
export const updateBillPaymentStatus = async (id, payload) =>
  unwrapApiResponse(await api.put(`/api/bills/payment/${id}`, payload));
