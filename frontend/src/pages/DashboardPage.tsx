import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { getDashboard } from '../services/api';
import type { DashboardResponse } from '../types';

const chartColors = ['#1f5fbf', '#4ea5ff', '#7ec8ff', '#dfeeff', '#123d7a'];

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setData(response);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load dashboard data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="panel"><p>Loading dashboard...</p></div>;
  }

  if (error || !data) {
    return (
      <div className="panel panel-error">
        <h3>Dashboard unavailable</h3>
        <p>{error || 'The dashboard could not be loaded.'}</p>
        <button type="button" onClick={fetchDashboard}>Retry</button>
      </div>
    );
  }

  const facilityChart = data.facilityStatusChart.map((item, index) => ({
    name: item.status || 'Unknown',
    value: Number(item.value || 0),
    fill: chartColors[index % chartColors.length],
  }));

  const inspectionChart = data.inspectionStatusChart.map((item, index) => ({
    name: item.status || 'Unknown',
    value: Number(item.value || 0),
    fill: chartColors[(index + 2) % chartColors.length],
  }));

  const complaintChart = data.complaintPrioritySummary.map((item, index) => ({
    name: item.priority || 'Unknown',
    value: Number(item.value || 0),
    fill: chartColors[(index + 3) % chartColors.length],
  }));

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <StatCard title="Total facilities" value={data.stats.totalFacilities} accent="#1f5fbf" />
        <StatCard title="Active facilities" value={data.stats.activeFacilities} accent="#2b9d7e" />
        <StatCard title="Maintenance" value={data.stats.maintenanceFacilities} accent="#e7a23f" />
        <StatCard title="Total inspections" value={data.stats.totalInspections} accent="#2f6de6" />
        <StatCard title="Pending inspections" value={data.stats.pendingInspections} accent="#d36643" />
        <StatCard title="Completed inspections" value={data.stats.completedInspections} accent="#3fa76f" />
        <StatCard title="Total complaints" value={data.stats.totalComplaints} accent="#3d4ec9" />
        <StatCard title="Open complaints" value={data.stats.openComplaints} accent="#d35d5d" />
        <StatCard title="Resolved complaints" value={data.stats.resolvedComplaints} accent="#2fa39d" />
      </div>

      <div className="chart-grid">
        <div className="panel chart-panel">
          <h3>Facility status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {facilityChart.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-panel">
          <h3>Inspection status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={inspectionChart} dataKey="value" nameKey="name" outerRadius={80} label>
                {inspectionChart.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-panel">
          <h3>Complaint priority summary</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={complaintChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {complaintChart.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="panel">
          <h3>Recent inspections</h3>
          {data.recentInspections.length === 0 ? (
            <p className="empty-state">No inspection records yet.</p>
          ) : (
            <ul className="list-rows">
              {data.recentInspections.map((item) => (
                <li key={item.id}>
                  <strong>{item.facility_name || 'Unknown facility'}</strong>
                  <span>{item.inspector_name}</span>
                  <span>{item.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>Recent complaints</h3>
          {data.recentComplaints.length === 0 ? (
            <p className="empty-state">No complaint records yet.</p>
          ) : (
            <ul className="list-rows">
              {data.recentComplaints.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.facility_name || 'Unknown facility'}</span>
                  <span>{item.priority}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
