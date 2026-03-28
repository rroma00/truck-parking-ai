import api from './api';

export const reservationsService = {
  async getReservations(locationId) {
    return await api.get(`/api/reservations/${locationId}`);
  },

  async updateReservation(id, updates) {
    return await api.patch(`/api/reservations/${id}`, updates);
  }
};
