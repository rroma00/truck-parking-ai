import api from './api';

export const availabilityService = {
  getAvailabilitySummary: (lotId) => {
    return api.get(`/availability/${lotId}`);
  },
  
  getSpots: (lotId, params = {}) => {
    // optionally pass { status, vehicle_type }
    return api.get(`/spots/${lotId}`, { params });
  },
  
  updateSpotStatus: (spotId, status, notes = '') => {
    return api.patch(`/spots/${spotId}/status`, { status, notes });
  },
  
  releaseSpot: (spotId, notes = '') => {
    return api.post(`/spots/${spotId}/release`, { notes });
  }
};
