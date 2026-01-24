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
    const response = await adminClient.post(`/admin/tickets/${id}/restock`, {
      quantity,
    });
    return response.data;
  },
  updateTicket: async (id: string, data: any) => {
    const response = await adminClient.put(`/admin/tickets/${id}`, data);
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await adminClient.get("/admin/users", { params });
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await adminClient.get(`/admin/users/${id}`);
    return response.data;
  },
  getUserEvents: async (id: string, params?: any) => {
    const response = await adminClient.get(`/admin/users/${id}/events`, {
      params,
    });
    return response.data;
  },

  // Finance
  getFinanceStats: async () => {
    const response = await adminClient.get("/admin/finance/stats");
    return response.data;
  },
  getPayouts: async (params?: any) => {
    const response = await adminClient.get("/admin/finance/payouts", {
      params,
    });
    return response.data;
  },
  getTransactions: async (params?: any) => {
    const response = await adminClient.get("/admin/finance/transactions", {
      params,
    });
    return response.data;
  },
  getTransaction: async (id: string) => {
    const response = await adminClient.get(`/admin/finance/transactions/${id}`);
    return response.data;
  },
  processPayout: async (id: string) => {
    const response = await adminClient.post(
      `/admin/finance/payouts/${id}/process`,
    );
    return response.data;
  },
  rejectPayout: async (id: string) => {
    const response = await adminClient.post(
      `/admin/finance/payouts/${id}/reject`,
    );
    return response.data;
  },

  // Support
  getTickets: async (params?: any) => {
    const response = await adminClient.get("/admin/support", { params });
    return response.data;
  },
  getTicket: async (id: string) => {
    const response = await adminClient.get(`/admin/support/${id}`);
    return response.data;
  },
  replyTicket: async (id: string, data: any) => {
    const response = await adminClient.post(`/admin/support/${id}/reply`, data);
    return response.data;
  },
  updateTicketStatus: async (id: string, status: string) => {
    const response = await adminClient.put(`/admin/support/${id}/status`, {
      status,
    });
    return response.data;
  },
  // Settings - Categories
  getCategories: () => adminClient.get("/admin/settings/categories"),
  createCategory: (data: any) =>
    adminClient.post("/admin/settings/categories", data),
  updateCategory: (id: number, data: any) =>
    adminClient.put(`/admin/settings/categories/${id}`, data),
  deleteCategory: (id: number) =>
    adminClient.delete(`/admin/settings/categories/${id}`),

  // Settings - Security
  updatePassword: (data: any) =>
    adminClient.post("/admin/update-password", data),

  // Trust Score
  getTrustTiers: () => adminClient.get("/admin/trust-tiers"),
  updateTrustTiers: (data: any) => adminClient.post("/admin/trust-tiers", data),
  createTrustTier: (data: any) => adminClient.post("/admin/trust-tiers/create", data),
  deleteTrustTier: (id: number) => adminClient.delete(`/admin/trust-tiers/${id}`),
  getTrustScoreSettings: () => adminClient.get("/admin/trust-score"),
  updateTrustScoreSettings: (data: any) => adminClient.post("/admin/trust-score", data),
  createTrustScoreSetting: (data: any) => adminClient.post("/admin/trust-score/create", data),
  deleteTrustScoreSetting: (key: string) => adminClient.delete(`/admin/trust-score/${key}`),

  // Settings - Config
  getConfig: () => adminClient.get("/admin/settings/config"),
  updateConfig: (data: any) => adminClient.post("/admin/settings/config", data),
};
