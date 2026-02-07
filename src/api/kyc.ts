import client from './client';
import { ApiResponse } from '@/types/api';

export const kycApi = {
    async getWidgetConfig(): Promise<any> {
        const response = await client.get<ApiResponse<any>>('/user/kyc/config');
        return response.data.data;
    },

    async handleVerificationSuccess(data: any): Promise<ApiResponse<{ message: string, data: any }>> {
        const response = await client.post<ApiResponse<{ message: string, data: any }>>('/user/kyc/success', data);
        return response.data;
    }
};
