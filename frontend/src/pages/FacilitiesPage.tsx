import { useEffect, useMemo, useState } from 'react';
import { createFacility, deleteFacility, getFacilities, updateFacility } from '../services/api';
import type { Facility } from '../types';

const emptyForm = {
  name: '',
  location: '',
  category: '',
  description: '',
  status: 'Active' as Facility['status'],
};

export function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const data = await getFacilities({
        search,
        category: categoryFilter,
        status: statusFilter,
      });
      setFacilities(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch facilities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [search, categoryFilter, statusFilter]);

  const categories = useMemo(
    () => Array.from(new Set(facilities.map((item) => item.category))).sort(),
    [facilities]
  );

  const filteredFacilities = facilities.filter((facility) => {
    const query = search.toLowerCase();
    const matchesSearch =
      facility.name.toLowerCase().includes(query) || facility.location.toLowerCase().includes(query);
    const matchesCategory = categoryFilter ? facility.category === categoryFilter : true;
    const matchesStatus = statusFilter ? facility.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.location || !form.category) {
      setError('Facility name, location, and category are required.');
      return;
    }

    try {
      setError('');
      if (editingId) {
        await updateFacility(editingId, form);
        setSuccess('Facility updated successfully.');
      } else {
        await createFacility(form);
        setSuccess('Facility added successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchFacilities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save facility.');
    }
  };

  const handleEdit = (facility: Facility) => {
    setForm({
      name: facility.name,
      location: facility.location,
      category: facility.category,
      description: facility.description,
      status: facility.status,
    });
    setEditingId(facility.id);
    setShowForm(true);
  };

  const handleDelete = async (facilityId: number) => {
    const confirmed = window.confirm('Delete this facility? This action also removes related inspections and complaints.');
    if (!confirmed) return;

    try {
      await deleteFacility(facilityId);
      setSuccess('Facility deleted successfully.');
      await fetchFacilities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete facility.');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="page-stack">
      <div className="toolbar panel">
        <div className="toolbar-group">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location"
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          + Add facility
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {success ? <div className="alert success">{success}</div> : null}

      {showForm ? (
        <div className="panel form-panel">
          <div className="form-header">
            <h3>{editingId ? 'Edit facility' : 'Add facility'}</h3>
            <button type="button" className="ghost-button" onClick={resetForm}>
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid-form">
            <label>
              Facility name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </label>
            <label>
              Category
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Facility['status'] })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </label>
            <label className="full-width">
              Description
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </label>
            <div className="form-actions full-width">
              <button type="submit" className="primary-button">
                {editingId ? 'Update facility' : 'Save facility'}
              </button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="panel table-panel">
        {loading ? (
          <p>Loading facilities...</p>
        ) : filteredFacilities.length === 0 ? (
          <p className="empty-state">No facilities match the current filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((facility) => (
                <tr key={facility.id}>
                  <td>{facility.name}</td>
                  <td>{facility.location}</td>
                  <td>{facility.category}</td>
                  <td>
                    <span className={`status-badge ${facility.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {facility.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(facility)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(facility.id)}>
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
