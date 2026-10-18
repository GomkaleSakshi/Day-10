import { Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations</p>
            <h1>Smart Facility Management System</h1>
          </div>
          <div className="topbar-badge">Live Status</div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
        </Routes>
      </main>
    </div>
  );
}
