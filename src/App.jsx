import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ROLES } from './utils/constants';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import FindDoctorsPage from './pages/public/FindDoctorsPage';
import DoctorDetailPage from './pages/public/DoctorDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import DoctorProfileSettings from './pages/doctor/DoctorProfileSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPatients from './pages/admin/AdminPatients';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminSpecialties from './pages/admin/AdminSpecialties';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="doctors" element={<FindDoctorsPage />} />
                <Route path="doctors/:doctorId" element={<DoctorDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* Patient Protected Portal */}
              <Route path="/patient" element={<DashboardLayout requiredRole={ROLES.PATIENT} />}>
                <Route index element={<PatientDashboard />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="profile" element={<PatientProfile />} />
              </Route>

              {/* Doctor Protected Portal */}
              <Route path="/doctor" element={<DashboardLayout requiredRole={ROLES.DOCTOR} />}>
                <Route index element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="availability" element={<DoctorAvailability />} />
                <Route path="profile" element={<DoctorProfileSettings />} />
              </Route>

              {/* Admin Protected Portal */}
              <Route path="/admin" element={<DashboardLayout requiredRole={ROLES.ADMIN} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="patients" element={<AdminPatients />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="specialties" element={<AdminSpecialties />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
