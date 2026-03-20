import api from './api';

export const dashboardService = {
  getSummary: (lotId) => {
    return api.get(`/dashboard/${lotId}`);
  },
  getAnalytics: (lotId, range = '7d') => {
    return api.get(`/analytics/${lotId}?range=${range}`);
  },
  getCallLogs: (lotId) => {
    return api.get(`/call-logs/${lotId}`);
  },
  getPricing: (lotId) => {
    return api.get(`/pricing/${lotId}`);
  },
  updatePricing: (lotId, overnight_price) => {
    return api.patch(`/pricing/${lotId}`, { overnight_price });
  }
};
