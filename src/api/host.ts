import client from './client';

export const hostApi = {
    async getEvents(params?: any) {
        const response = await client.get('/user/host/events', { params });
        return response.data;
    },

    async getEventDetails(id: string) {
        const response = await client.get(`/user/host/events/${id}`);
        return response.data;
    },

    async getStats() {
        const response = await client.get('/user/host/stats');
        return response.data;
    },

    async getRecentActivity() {
        const response = await client.get('/user/host/recent-activity');
        return response.data;
    },

    async getChart(params?: any) {
        const response = await client.get('/user/host/chart', { params });
        return response.data;
    },

    async getTrustScore() {
        const response = await client.get('/user/host/trust-score');
        return response.data;
    },

    async getEventWithdrawalLimit(eventId: string) {
        const response = await client.get(`/user/host/events/${eventId}/withdrawal-limit`);
        return response.data;
    },

    async requestWithdrawal(eventId: string, amount: number) {
        const response = await client.post('/user/host/events/withdraw', { event_id: eventId, amount });
        return response.data;
    },

    async refundTicket(ticketId: string) {
        const response = await client.post(`/user/host/tickets/${ticketId}/refund`);
        return response.data;
    }
};
