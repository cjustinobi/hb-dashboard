import api from './api';
import { 
  ConsultationType, 
  ConsultationBenefit, 
  ApiResponse, 
} from '../types';

const BASE_URL = '/admin';

const consultationService = {
  // Consultation Types
  listTypes: async (): Promise<ApiResponse<ConsultationType[]>> => {
    const response = await api.get(`${BASE_URL}/consultation-types`);
    return response.data;
  },

  createType: async (data: Partial<ConsultationType>): Promise<ApiResponse<ConsultationType>> => {
    const response = await api.post(`${BASE_URL}/consultation-types`, data);
    return response.data;
  },

  updateType: async (id: string, data: Partial<ConsultationType>): Promise<ApiResponse<ConsultationType>> => {
    const response = await api.put(`${BASE_URL}/consultation-types/${id}`, data);
    return response.data;
  },

  deleteType: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`${BASE_URL}/consultation-types/${id}`);
    return response.data;
  },

  // Consultation Benefits
  listBenefits: async (): Promise<ApiResponse<ConsultationBenefit[]>> => {
    const response = await api.get(`${BASE_URL}/consultation-benefits`);
    return response.data;
  },

  createBenefit: async (data: Partial<ConsultationBenefit>): Promise<ApiResponse<ConsultationBenefit>> => {
    const response = await api.post(`${BASE_URL}/consultation-benefits`, data);
    return response.data;
  },

  updateBenefit: async (id: string, data: Partial<ConsultationBenefit>): Promise<ApiResponse<ConsultationBenefit>> => {
    const response = await api.put(`${BASE_URL}/consultation-benefits/${id}`, data);
    return response.data;
  },

  deleteBenefit: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`${BASE_URL}/consultation-benefits/${id}`);
    return response.data;
  },

  // Type-Benefit Linking
  listTypeBenefits: async (typeId: string): Promise<ApiResponse<ConsultationBenefit[]>> => {
    const response = await api.get(`${BASE_URL}/consultation-types/${typeId}/benefits`);
    return response.data;
  },

  linkBenefit: async (typeId: string, benefitId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`${BASE_URL}/consultation-types/${typeId}/benefits/${benefitId}`);
    return response.data;
  },

  unlinkBenefit: async (typeId: string, benefitId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`${BASE_URL}/consultation-types/${typeId}/benefits/${benefitId}`);
    return response.data;
  },
};

export default consultationService;
