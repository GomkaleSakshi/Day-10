import { useEffect, useState } from 'react';
import { createInspection, deleteInspection, getFacilities, getInspections, updateInspection } from '../services/api';
import type { Facility, Inspection } from '../types';

const emptyForm = {
  facility_id: '',
  inspector_name: '',
  inspection_date: '',
  status: 'Pending' as Inspection['status'],
  findings: '',
  remarks: '',
};

export function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [facilityFilter, setFacilityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refreshData = async () => {
    try {
      setLoading(true);
      const [inspectionData, facilityData] = await Promise.all([
        getInspections({
          facility_id: facilityFilter,
          status: statusFilter,
          date: searchDate,
        }),
        getFacilities(),
      ]);
      setInspections(inspectionData);
      setFacilities(facilityData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load inspections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [facilityFilter, statusFilter, searchDate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.facility_id || !form.inspector_name || !form.inspection_date) {
      setError('Facility, inspector name, and inspection date are required.');
      return;
    }

    try {
      setError('');
      const payload = {
        ...form,
        facility_id: Number(form.facility_id),
      };

      if (editingId) {
        await updateInspection(editingId, payload);
        setSuccess('Inspection updated successfully.');
      } else {
        await createInspection(payload);
        setSuccess('Inspection created successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save inspection.');
    }
  };

  const handleEdit = (inspection: Inspection) => {
    setForm({
      facility_id: String(inspection.facility_id),
      inspector_name: inspection.inspector_name,
      inspection_date: inspection.inspection_date,
      status: inspection.status,
      findings: inspection.findings || '',
      remarks: inspection.remarks || '',
    });
    setEditingId(inspection.id);
    setShowForm(true);
  };

  const handleDelete = async (inspectionId: number) => {
    const confirmed = window.confirm('Delete this inspection record?');
    if (!confirmed) return;
    try {
      await deleteInspection(inspectionId);
      setSuccess('Inspection deleted successfully.');
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete inspection.');
    }
  };

  return (
    <div className="page-stack">
      <div className="toolbar panel">
        <div className="toolbar-group">
          <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)}>
            <option value="">All facilities</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={String(facility.id)}>
                {facility.name}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          + Add inspection
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {success ? <div className="alert success">{success}</div> : null}

      {showForm ? (
        <div className="panel form-panel">
          <div className="form-header">
            <h3>{editingId ? 'Edit inspection' : 'Add inspection'}</h3>
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
              Inspector name
              <input value={form.inspector_name} onChange={(e) => setForm({ ...form, inspector_name: e.target.value })} />
            </label>
            <label>
              Inspection date
              <input type="date" value={form.inspection_date} onChange={(e) => setForm({ ...form, inspection_date: e.target.value })} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Inspection['status'] })}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </label>
            <label className="full-width">
              Findings
              <textarea value={form.findings} onChange={(e) => setForm({ ...form, findings: e.target.value })} rows={4} />
            </label>
            <label className="full-width">
              Remarks
              <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={3} />
            </label>
            <div className="form-actions full-width">
              <button type="submit" className="primary-button">
                {editingId ? 'Update inspection' : 'Save inspection'}
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
          <p>Loading inspections...</p>
        ) : inspections.length === 0 ? (
          <p className="empty-state">No inspection records available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Inspector</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection) => (
                <tr key={inspection.id}>
                  <td>{inspection.facility_name || 'Unknown facility'}</td>
                  <td>{inspection.inspector_name}</td>
                  <td>{new Date(inspection.inspection_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${inspection.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {inspection.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(inspection)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(inspection.id)}>
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
