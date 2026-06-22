import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Modal } from './components/ui/Modal';
import { ToastContainer } from './components/ui/Toast';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { StaffPage } from './pages/StaffPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { CancellationsPage } from './pages/CancellationsPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { PerformancePage } from './pages/PerformancePage';
import { PayrollPage } from './pages/PayrollPage';
import { AdvancesPage } from './pages/AdvancesPage';
import { GodownsPage } from './pages/GodownsPage';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'events': return <EventsPage />;
      case 'quotations': return <QuotationsPage />;
      case 'invoices': return <InvoicesPage />;
      case 'checklists': return <ChecklistsPage />;
      case 'staff': return <StaffPage />;
      case 'applications': return <ApplicationsPage />;
      case 'cancellations': return <CancellationsPage />;
      case 'promotions': return <PromotionsPage />;
      case 'performance': return <PerformancePage />;
      case 'payroll': return <PayrollPage />;
      case 'advances': return <AdvancesPage />;
      case 'godowns': return <GodownsPage />;
      default:
        return (
          <div className="empty-state">
            <div className="empty-icon">🚧</div>
            <div className="empty-title">Under Construction</div>
            <div className="empty-desc">This page is not fully converted to React yet.</div>
          </div>
        );
    }
  };

  return (
    <div id="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content" id="content">
          {renderPage()}
        </main>
      </div>
      <ToastContainer />
      <Modal />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
