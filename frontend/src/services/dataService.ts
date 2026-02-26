import api from './api';
import type { AnalyticsSummary, DetailedQRAnalytics, QRCodeContext } from '../types';

export const qrService = {
    /**
     * Generates a new dynamic QR Code via the backend Engine.
     */
    createQR: async (data: Partial<QRCodeContext>) => {
        const response = await api.post('/qr', data);
        return response.data;
    },

    /**
     * Retrieves all QRs for the currently authenticated User
     */
    getMyQRs: async () => {
        const response = await api.get('/qr');
        return response.data;
    },

    /**
     * Gets specific QR instance
     */
    getQRById: async (id: string) => {
        const response = await api.get(`/qr/${id}`);
        return response.data;
    },

    /**
     * Patches a QR code, updating visual styles or destination links live
     */
    updateQR: async (id: string, updates: Partial<QRCodeContext>) => {
        const response = await api.put(`/qr/${id}`, updates);
        return response.data;
    },

    /**
     * Hard Deletes a QR
     */
    deleteQR: async (id: string) => {
        const response = await api.delete(`/qr/${id}`);
        return response.data;
    }
};

export const analyticsService = {
    /**
     * Provides baseline dashboard metrics globally
     */
    getDashboardSummary: async (): Promise<{ success: boolean; data: AnalyticsSummary }> => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },

    /**
     * Grabs deep scan metrics, OS distribution, and browser tracking per specific QR Code id
     */
    getSpecificAnalytics: async (qrId: string): Promise<{ success: boolean; data: DetailedQRAnalytics }> => {
        const response = await api.get(`/analytics/qr/${qrId}`);
        return response.data;
    }
};

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (credentials: any) => {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    }
};
