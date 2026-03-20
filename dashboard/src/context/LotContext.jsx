import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const LotContext = createContext(null);

export const LotProvider = ({ children }) => {
  const [selectedLotId, setSelectedLotId] = useState('7283583f-56e5-4ded-9c75-c55e8a128910');
  const [lotDetails, setLotDetails] = useState(null);

  // Optionally fetch the base lot details whenever the ID changes
  useEffect(() => {
    if (selectedLotId) {
      api.get(`/lots/${selectedLotId}`)
        .then(data => setLotDetails(data))
        .catch(err => console.error("Failed to load lot context:", err));
    }
  }, [selectedLotId]);

  return (
    <LotContext.Provider value={{ selectedLotId, setSelectedLotId, lotDetails }}>
      {children}
    </LotContext.Provider>
  );
};
