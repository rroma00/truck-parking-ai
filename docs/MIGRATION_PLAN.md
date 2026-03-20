# Dashboard UI Migration Plan

## Goal Description
The goal is to fully migrate the current dashboard UI to match the new "Precision Architect" design system provided in `template/Dashboard/code.html` and `DESIGN.md`. This involves replacing the current layout (left sidebar + main content) with the new layout (TopNav + main content with right sidebar), adopting Tailwind CSS via CDN (since the current project uses custom CSS utilities), and migrating the `Dashboard.jsx` content to the new "Location Setup" view exactly as depicted in the template.

## Proposed Changes

### Configuration & Global Styles
- **`dashboard/index.html`**:
  - Add Tailwind CSS CDN script with the custom configuration (colors, fonts, border radius) found in `code.html`.
  - Add Google Fonts (Manrope and Inter).
- **`dashboard/src/index.css`**:
  - Remove custom utility classes (`.flex`, `.text-sm`, etc.) to prevent conflicts with Tailwind.
  - Keep base resets, `::-webkit-scrollbar` custom styling, and `.material-symbols-outlined` tweaks.

### Layout & Components
- **`dashboard/src/components/layout/AppLayout.jsx`**:
  - Replace the old Layout (which used `Sidebar.jsx` and `Header.jsx`) with the new `TopNavBar` from `code.html`.
  - The main structure will be a `<nav>` for the header and an `<Outlet />` for the page content.
- **`dashboard/src/components/layout/Sidebar.jsx`** & **`dashboard/src/components/layout/Header.jsx`**:
  - These will be unmounted/deleted as the new design does not use them in the same way.

### Pages
- **`dashboard/src/pages/Dashboard.jsx`**:
  - Completely replace the current KPI and chart dashboard with the "Location Setup" content from `code.html`.
  - This includes the Header Section (`<header>...`), the Left Column Form (`<div class="lg:col-span-8">...`), and the Right Column Sidebar (`<div class="lg:col-span-4 sticky top-28">...`).
  - Convert HTML class attributes to React `className`, close unclosed tags (like `<input>` and `<img>`), and ensure JSX validity.

## Verification Plan

### Automated Tests
- Run `npm run lint` if configured, or rely on Vite build.
- Run `npm run build` in the `dashboard` directory to ensure there are no JSX synthesis errors.

### Manual Verification
- Start the Vite dev server (`npm run dev`).
- Open the application in the browser.
- Verify that the layout, colors, typography, and spacing match the `template/Dashboard/screen.png` precisely.
- Verify that the user can navigate to the root route (`/`) and see the new Location Setup page.
