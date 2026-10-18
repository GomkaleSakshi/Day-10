import { useEffect, useState } from 'react';
import { createComplaint, deleteComplaint, getComplaints, getFacilities, updateComplaint } from '../services/api';
import type { Complaint, Facility } from '../types';

const emptyForm = {
  facility_id: '',
  title: '',
  description: '',
  priority: 'Medium' as Complaint['priority'],
  status: 'Open' as Complaint['status'],
  reported_by: '',
  resolution_notes: '',
};

export function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refreshData = async () => {
    try {
      setLoading(true);
      const [complaintData, facilityData] = await Promise.all([
        getComplaints({
          facility_id: facilityFilter,
          status: statusFilter,
          priority: priorityFilter,
          search,
        }),
        getFacilities(),
      ]);
      setComplaints(complaintData);
      setFacilities(facilityData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [search, facilityFilter, statusFilter, priorityFilter]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.facility_id || !form.title || !form.description || !form.reported_by) {
      setError('Facility, title, description, and reporter name are required.');
      return;
    }

    try {
      setError('');
      const payload = {
        ...form,
        facility_id: Number(form.facility_id),
      };

      if (editingId) {
        await updateComplaint(editingId, payload);
        setSuccess('Complaint updated successfully.');
      } else {
        await createComplaint(payload);
        setSuccess('Complaint created successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save complaint.');
    }
  };

  const handleEdit = (complaint: Complaint) => {
    setForm({
      facility_id: String(complaint.facility_id),
      title: complaint.title,
      description: complaint.description,
      priority: complaint.priority,
      status: complaint.status,
      reported_by: complaint.reported_by,
      resolution_notes: complaint.resolution_notes || '',
    });
    setEditingId(complaint.id);
    setShowForm(true);
  };

  const handleDelete = async (complaintId: number) => {
    const confirmed = window.confirm('Delete this complaint record?');
    if (!confirmed) return;

    try {
      await deleteComplaint(complaintId);
      setSuccess('Complaint deleted successfully.');
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete complaint.');
    }
  };

  return (
    <div className="page-stack">
      <div className="toolbar panel">
        <div className="toolbar-group">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaint or reporter"
          />
          <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)}>
            <option value="">All facilities</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={String(facility.id)}>
                {facility.name}
              </option>
            ))}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          + Add complaint
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {success ? <div className="alert success">{success}</div> : null}

      {showForm ? (
        <div className="panel form-panel">
          <div className="form-header">
            <h3>{editingId ? 'Edit complaint' : 'Register complaint'}</h3>
            <button type="button" className="ghost-button" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid-form">
            <label>
              Facility
              <select value={form.facility_id} onChange={(e) => setForm({ ...form, facility_id: e.target.value })}>
                <option value="">Select facility</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={String(facility.id)}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reported by
              <input value={form.reported_by} onChange={(e) => setForm({ ...form, reported_by: e.target.value })} />
            </label>
            <label>
              Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              Priority
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Complaint['priority'] })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Complaint['status'] })}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label className="full-width">
              Description
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </label>
            <label className="full-width">
              Resolution notes
              <textarea value={form.resolution_notes} onChange={(e) => setForm({ ...form, resolution_notes: e.target.value })} rows={3} />
            </label>
            <div className="form-actions full-width">
              <button type="submit" className="primary-button">
                {editingId ? 'Update complaint' : 'Save complaint'}
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="panel table-panel">
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="empty-state">No complaint records available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reporter</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.facility_name || 'Unknown facility'}</td>
                  <td>{complaint.title}</td>
                  <td>
                    <span className={`status-badge ${complaint.priority.toLowerCase()}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${complaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{complaint.reported_by}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(complaint)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(complaint.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
