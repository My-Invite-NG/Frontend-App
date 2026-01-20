import adminClient from "./adminClient";

export const adminApi = {
  login: async (credentials: any) => {
    const response = await adminClient.post("/admin/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await adminClient.post("/admin/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await adminClient.get("/admin/me");
    return response.data;
  },

  getStats: async () => {
    const response = await adminClient.get("/admin/stats");
    return response.data;
  },

  // Events
  getEvents: async (params?: any) => {
    const response = await adminClient.get("/admin/events", { params });
    return response.data;
  },
  getEvent: async (id: string) => {
    const response = await adminClient.get(`/admin/events/${id}`);
    return response.data;
  },
  approveEvent: async (id: string) => {
    const response = await adminClient.post(`/admin/events/${id}/approve`);
    return response.data;
  },
  rejectEvent: async (id: string) => {
    const response = await adminClient.post(`/admin/events/${id}/reject`);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await adminClient.delete(`/admin/events/${id}`);
    return response.data;
  },

  // Tickets
  restockTicket: async (id: string, quantity: number) => {
    const response = await adminClient.post(`/admin/tickets/${id}/restock`, { quantity });
    return response.data;
  },
  updateTicket: async (id: string, data: any) => {
    const response = await adminClient.put(`/admin/tickets/${id}`, data);
    return response.data;
  },
};
