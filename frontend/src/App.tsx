import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveLogViewerPage } from './pages/LiveLogViewerPage';
import { SearchPage } from './pages/SearchPage';
import { DevicesPage } from './pages/DevicesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { IncidentBoardPage } from './pages/IncidentBoardPage';
import { MITRECoveragePage } from './pages/MITRECoveragePage';
import { PipelineDashboardPage } from './pages/PipelineDashboardPage';
import { SigmaRulesPage } from './pages/SigmaRulesPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute>
                    <AIAssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/incidents"
                element={
                  <ProtectedRoute>
                    <IncidentBoardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mitre-matrix"
                element={
                  <ProtectedRoute>
                    <MITRECoveragePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sigma-rules"
                element={
                  <ProtectedRoute>
                    <SigmaRulesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline-health"
                element={
                  <ProtectedRoute>
                    <PipelineDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live-logs"
                element={
                  <ProtectedRoute>
                    <LiveLogViewerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <ProtectedRoute>
                    <DevicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <AlertsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute>
                    <AuditLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
