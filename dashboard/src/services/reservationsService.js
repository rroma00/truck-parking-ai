import api from './api';

export const reservationsService = {
  getReservations: (lotId, params = {}) => {
    // params can include status, phone_number, limit, offset
    return api.get(`/reservations/${lotId}`, { params });
  },
  
  getDetail: (reservationId) => {
    return api.get(`/reservations/detail/${reservationId}`);
  },
  
  createReservation: (data) => {
    // data must include lot_id, spot_id, phone_number, customer_name, vehicle_type, status, source, etc.
    return api.post('/reservations', data);
  },
  
  autoAssign: (data) => {
    // Omits spot_id, backend will find it
    return api.post('/reservations/auto-assign', data);
  },
  
  updateReservation: (reservationId, updateData) => {
    return api.patch(`/reservations/${reservationId}`, updateData);
  },
  
  cancelReservation: (reservationId, notes = '') => {
    return api.post(`/reservations/${reservationId}/cancel`, { notes });
  }
};
