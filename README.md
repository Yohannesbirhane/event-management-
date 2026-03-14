# Event Management System

A comprehensive, responsive event management web application built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/). This platform provides both a seamless user-facing interface for discovering and booking events, and a powerful admin dashboard for comprehensive system management.

## ?? Key Features

### ?? User Portal
- **Service Browsing:** View diverse event management services with detailed descriptions.
- **Event Gallery:** High-quality image gallery showcasing past events.
- **Booking & Registration:** Seamless booking workflow and event registration with intuitive forms.
- **Ticket/QR Code System:** QR Code integration (QRCodeDisplay) for quick check-ins and ticket verification.
- **Secure Payments:** Integrated payment forms for easy checkout.
- **Multi-Language Support (i18n):** Fully localized interface supporting English (EN) and Amharic (AM).
- **Theme Customization:** Global Light and Dark mode variations for better accessibility.
- **User Profiles:** Manage personal information, active bookings, and preferences.

### ??? Admin Dashboard
- **Comprehensive Analytics:** Dashboard with statistics and reporting tools.
- **Service & Gallery Management:** Add, edit, or remove services and gallery images through custom modal interfaces.
- **Booking Administration:** Detailed data tables for viewing and updating booking statuses.
- **User Management:** Handle user accounts, registrations, and administrative privileges.
- **Notifications system:** Real-time updates and alerts for platform activity.

## ??? Technology Stack
- **Frontend Framework:** React, Vite
- **Styling:** Custom CSS (App.css, index.css, dark-mode.css)
- **State Management:** React Context API (AuthContext, ThemeContext)
- **Internationalization:** custom i18n setup with localized JSONs 
- **Tooling:** ESLint, npm/yarn workspaces

## ?? Project Organization

`	ext
src/
+-- admin/          # Admin Dashboard layout, pages, and admin-specific components
+-- api/            # Axios/Fetch API service handlers (auth, users, dashboard, etc.)
+-- assets/         # Static configuration assets
+-- components/     # Reusable UI components (Navbar, Footer, Forms, Cards, Testimonials)
+-- contexts/       # Global React contexts (Authentication and Theming)
+-- i18n/           # Internationalization setup and locale files (en.json, am.json)
+-- layouts/        # Page wrappers (MainLayout vs. AdminLayout)
+-- pages/          # Public application routes (Home, About, Booking, Login, Gallery)
`

## ?? Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   `ash
   cd event-managment
   `

2. **Install dependencies:**
   `ash
   npm install
   # or
   yarn install
   `

3. **Start the development server:**
   `ash
   npm run dev
   # or
   yarn dev
   `

4. **Open the application:**
   Navigate to the local URL (usually http://localhost:5173) in your preferred browser.
