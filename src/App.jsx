import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import FeedbackListPage from './pages/feedback/FeedbackListPage';
import FeedbackDetailsPage from './pages/feedback/FeedbackDetailsPage';
import ImportFeedbackPage from './pages/feedback/ImportFeedbackPage';
import ConnectorsPage from './pages/connectors/ConnectorsPage';
import ComplaintsOverviewPage from './pages/complaints/ComplaintsOverviewPage';
import ComplaintCategoriesPage from './pages/complaints/ComplaintCategoriesPage';
import RecurringComplaintsPage from './pages/complaints/RecurringComplaintsPage';
import ComplaintExplorerPage from './pages/complaints/ComplaintExplorerPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import InsightsPage from './pages/insights/InsightsPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/:feedbackId"
          element={
            <ProtectedRoute>
              <FeedbackDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/import"
          element={
            <ProtectedRoute>
              <ImportFeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connectors"
          element={
            <ProtectedRoute>
              <ConnectorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ComplaintsOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/categories"
          element={
            <ProtectedRoute>
              <ComplaintCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/recurring"
          element={
            <ProtectedRoute>
              <RecurringComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/explorer"
          element={
            <ProtectedRoute>
              <ComplaintExplorerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends"
          element={
            <ProtectedRoute>
              <DashboardPage />
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
