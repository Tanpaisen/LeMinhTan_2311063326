import axiosClient from './axiosClient';
import { ApiKey, ApiKeyCreateRequest } from '../types/apiKey';

export const apiKeyApi = {
    getAll: async (): Promise<ApiKey[]> => {
        const response = await axiosClient.get('/api/api-keys');
        return response.data;
    },

    create: async (data: ApiKeyCreateRequest): Promise<ApiKey> => {
        const response = await axiosClient.post('/api/api-keys', data);
        return response.data;
    },

    revoke: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/api-keys/${id}`);
    }
};