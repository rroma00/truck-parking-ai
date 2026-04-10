import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { LotProvider } from './context/LotContext';

// Pages
import Dashboard from './pages/Dashboard';
import Location from './pages/Location';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import CustomerManagement from './pages/CustomerManagement';
import Legal from './pages/Legal';
import SignIn from './pages/SignIn';
import Settings from './pages/Settings';
import Spaces from './pages/Spaces';


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
          element={(
            <OnboardingGuard>
              <LotProvider>
                <AppLayout />
              </LotProvider>
            </OnboardingGuard>
          )}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/location" element={<Location />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/settings" element={<Settings title="Settings" />} />
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
