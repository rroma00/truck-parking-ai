import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { LotProvider } from './context/LotContext';

// Pages
import Dashboard from './pages/Dashboard';
import CallLogs from './pages/CallLogs';
import Reservations from './pages/Reservations';
import ParkingAvailability from './pages/ParkingAvailability';
import Pricing from './pages/Pricing';
import AiSettings from './pages/AiSettings';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Landing from './pages/Landing';

import './App.css';

function App() {
  return (
    <LotProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-logs" element={<CallLogs />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/parking-availability" element={<ParkingAvailability />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/ai-settings" element={<AiSettings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LotProvider>
  );
}

export default App;
