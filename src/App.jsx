import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ExchangeProvider } from './context/ExchangeContext';
import { MessageProvider } from './context/MessageContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ExploreSkillsPage from './pages/ExploreSkillsPage';
import StudentProfilesPage from './pages/StudentProfilesPage';
import StudentDetailPage from './pages/StudentDetailPage';
import SkillExchangesPage from './pages/SkillExchangesPage';
import MessagesPage from './pages/MessagesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// 404 Component
function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The page you are looking for does not exist or has been moved to another skill exchange route.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ExchangeProvider>
          <MessageProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing & Authentication Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Dashboard & Workspace Layout */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/skills" element={<ExploreSkillsPage />} />
                  <Route path="/students" element={<StudentProfilesPage />} />
                  <Route path="/students/:id" element={<StudentDetailPage />} />
                  <Route path="/exchanges" element={<SkillExchangesPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/profile" element={<ProfileSettingsPage />} />
                  <Route path="/settings" element={<Navigate to="/profile" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </MessageProvider>
        </ExchangeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
