import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const LotContext = createContext(null);

export const useLot = () => {
  const context = useContext(LotContext);
  if (context === undefined) {
    throw new Error('useLot must be used within a LotProvider');
  }
  return context;
};

export const LotProvider = ({ children }) => {
  const [selectedLotId, setSelectedLotId] = useState('7283583f-56e5-4ded-9c75-c55e8a128910');
  const [lotDetails, setLotDetails] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadLots = async () => {
      try {
        const lots = await api.get('/lots');
        if (!isMounted || !Array.isArray(lots) || lots.length === 0) return;

        const selectedExists = lots.some((lot) => lot.id === selectedLotId);
        if (!selectedExists) {
          setSelectedLotId(lots[0].id);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load lots:', err);
        setLotDetails(null);
      }
    };

    loadLots();

    return () => {
      isMounted = false;
    };
  }, [selectedLotId]);

  useEffect(() => {
    if (!selectedLotId) {
      setLotDetails(null);
      return;
    }

    let isMounted = true;

    const loadLotDetails = async () => {
      try {
        const data = await api.get(`/lots/${selectedLotId}`);
        if (!isMounted) return;
        setLotDetails(data || null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load lot context:', err);
        setLotDetails(null);
      }
    };

    loadLotDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedLotId]);

  return (
    <LotContext.Provider value={{ selectedLotId, setSelectedLotId, lotDetails }}>
      {children}
    </LotContext.Provider>
  );
};
