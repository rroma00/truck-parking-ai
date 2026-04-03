import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
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
import Onboarding from './pages/Onboarding';
import CustomerManagement from './pages/CustomerManagement';
import Legal from './pages/Legal';
import SignIn from './pages/SignIn';

import './App.css';

function getOnboardingCompleteFlag() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem('onboardingComplete') === 'true';
  } catch (error) {
    console.error('[OnboardingGuard] Failed to read onboardingComplete flag', error);
    return false;
  }
}

function OnboardingGuard({ children }) {
  const onboardingComplete = getOnboardingCompleteFlag();

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route
          path="/customer-management"
          element={(
            <LotProvider>
              <CustomerManagement />
            </LotProvider>
          )}
        />
        <Route
          path="/drivers"
          element={(
            <LotProvider>
              <CustomerManagement />
            </LotProvider>
          )}
        />
        <Route
          element={(
            <OnboardingGuard>
              <LotProvider>
                <AppLayout />
              </LotProvider>
            </OnboardingGuard>
          )}
        >
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
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route path="/sign-in" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
