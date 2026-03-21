# Landing Page Update

## Overview
Replaced the default dashboard entry point with a newly developed Landing Page for the Truck Parking AI application. 

## Features
- **New Landing Page Component**: `dashboard/src/pages/Landing.jsx`. This acts as the main hook, featuring:
  - High-impact hero section with "PRECISION LOGISTICS" branding.
  - Interactive "Live Fleet Overview" mockup displaying sample notifications (Arrivals, AI State).
  - 4 key feature cards outlining 24/7 Driver Support, Automated Arrivals, Call Reduction, and Professional Experience.
  - A mock AI SMS exchange showing exactly how drivers interact with the ParkLog AI assistant.
  - A 3-step easy onboarding guide.
- **Routing Updates**:
  - `App.jsx` updated to render `<Landing />` at the root path (`/`).
  - The main application interface wrapper, `<AppLayout />`, now serves on `/dashboard`.
  - Nested routes for the dashboard application are now securely mounted behind the `/dashboard` path.
  - Modified `<AppLayout />` internal links to correctly direct to `/dashboard` home instead of `/`.

## Design Style
- Implemented using Tailwind CSS in a standard React environment.
- Dark Navy (`#050F36`), pure white frames, and subtle gray backgrounds (`#F7F9FF`) to provide an executive SaaS look.
- Modern aesthetics utilizing rounded corners, overlapping elements, glassmorphism, and minimal clean typography focusing heavily on `Inter` and `Manrope` fonts.

## Next Steps
- Link authentication paths (Login, Signup via "Get Started"). Currently buttons point to the `/onboarding` and `/login` routes.
