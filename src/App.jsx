import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
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
import FeatureRequestsOverviewPage from './pages/feature-requests/FeatureRequestsOverviewPage';
import DemandRankingPage from './pages/feature-requests/DemandRankingPage';
import FeatureRequestExplorerPage from './pages/feature-requests/FeatureRequestExplorerPage';
import FeatureRequestTrendsPage from './pages/feature-requests/FeatureRequestTrendsPage';
import ChurnRiskOverviewPage from './pages/churn-risk/ChurnRiskOverviewPage';
import HighRiskCustomersPage from './pages/churn-risk/HighRiskCustomersPage';
import CustomerExplorerPage from './pages/churn-risk/CustomerExplorerPage';
import RiskTrendsPage from './pages/churn-risk/RiskTrendsPage';
import RetentionInsightsPage from './pages/churn-risk/RetentionInsightsPage';
import TrendOverviewPage from './pages/trends/TrendOverviewPage';
import EmergingTopicsPage from './pages/trends/EmergingTopicsPage';
import TrendExplorerPage from './pages/trends/TrendExplorerPage';
import ComplaintTrendsPage from './pages/trends/ComplaintTrendsPage';
import FeatureTrendsPage from './pages/trends/FeatureTrendsPage';
import TrendHistoryPage from './pages/trends/TrendHistoryPage';
import SemanticSearchPage from './pages/ai-discovery/SemanticSearchPage';
import SimilarFeedbackPage from './pages/ai-discovery/SimilarFeedbackPage';
import SimilarComplaintsPage from './pages/ai-discovery/SimilarComplaintsPage';
import SimilarFeatureRequestsPage from './pages/ai-discovery/SimilarFeatureRequestsPage';
import SearchHistoryPage from './pages/ai-discovery/SearchHistoryPage';
import CurrentPlanPage from './pages/billing/CurrentPlanPage';
import PlansPage from './pages/billing/PlansPage';
import UsagePage from './pages/billing/UsagePage';
import InvoicesPage from './pages/billing/InvoicesPage';
import SubscriptionHistoryPage from './pages/billing/SubscriptionHistoryPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import InsightsPage from './pages/insights/InsightsPage';
import SettingsPage from './pages/settings/SettingsPage';
import PlatformOverviewPage from './pages/admin/PlatformOverviewPage';
import OrganizationsPage from './pages/admin/OrganizationsPage';
import OrganizationDetailsPage from './pages/admin/OrganizationDetailsPage';
import UsersPage from './pages/admin/UsersPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import AIUsagePage from './pages/admin/AIUsagePage';
import SystemHealthPage from './pages/admin/SystemHealthPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import GlobalSettingsPage from './pages/admin/GlobalSettingsPage';
import SupportToolsPage from './pages/admin/SupportToolsPage';

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
          path="/feature-requests"
          element={
            <ProtectedRoute>
              <FeatureRequestsOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feature-requests/demand"
          element={
            <ProtectedRoute>
              <DemandRankingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feature-requests/explorer"
          element={
            <ProtectedRoute>
              <FeatureRequestExplorerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feature-requests/trends"
          element={
            <ProtectedRoute>
              <FeatureRequestTrendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn-risk"
          element={
            <ProtectedRoute>
              <ChurnRiskOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn-risk/high-risk"
          element={
            <ProtectedRoute>
              <HighRiskCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn-risk/explorer"
          element={
            <ProtectedRoute>
              <CustomerExplorerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn-risk/trends"
          element={
            <ProtectedRoute>
              <RiskTrendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn-risk/insights"
          element={
            <ProtectedRoute>
              <RetentionInsightsPage />
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
              <TrendOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends/emerging"
          element={
            <ProtectedRoute>
              <EmergingTopicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends/explorer"
          element={
            <ProtectedRoute>
              <TrendExplorerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends/complaints"
          element={
            <ProtectedRoute>
              <ComplaintTrendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends/features"
          element={
            <ProtectedRoute>
              <FeatureTrendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends/history"
          element={
            <ProtectedRoute>
              <TrendHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-discovery"
          element={
            <ProtectedRoute>
              <SemanticSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-discovery/similar-feedback"
          element={
            <ProtectedRoute>
              <SimilarFeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-discovery/similar-complaints"
          element={
            <ProtectedRoute>
              <SimilarComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-discovery/similar-features"
          element={
            <ProtectedRoute>
              <SimilarFeatureRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-discovery/history"
          element={
            <ProtectedRoute>
              <SearchHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <CurrentPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/usage"
          element={
            <ProtectedRoute>
              <UsagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/history"
          element={
            <ProtectedRoute>
              <SubscriptionHistoryPage />
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
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <PlatformOverviewPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/organizations"
          element={
            <AdminRoute>
              <OrganizationsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/organizations/:organizationId"
          element={
            <AdminRoute>
              <OrganizationDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <AdminRoute>
              <SubscriptionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ai-usage"
          element={
            <AdminRoute>
              <AIUsagePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/system-health"
          element={
            <AdminRoute>
              <SystemHealthPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <AdminRoute>
              <AuditLogsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <GlobalSettingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminRoute>
              <SupportToolsPage />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
