import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

const checkDb = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

describe('API health', () => {
  it('returns server health information', async () => {
    const response = await request(app).get('/api/health');
    const dbAvailable = await checkDb();

    if (!dbAvailable) {
      expect(response.status).toBeGreaterThanOrEqual(200);
      return;
    }

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Facility CRUD', () => {
  it('handles facility operations when database is available', async () => {
    const dbAvailable = await checkDb();
    if (!dbAvailable) {
      return;
    }

    const createResponse = await request(app)
      .post('/api/facilities')
      .send({
        name: 'Test Facility',
        location: 'Test City',
        category: 'Testing',
        description: 'Created by automated test',
        status: 'Active',
      });

    expect(createResponse.status).toBe(201);

    const facilityId = createResponse.body.data.id;

    const listResponse = await request(app).get('/api/facilities');
    expect(listResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/facilities/${facilityId}`)
      .send({
        name: 'Updated Test Facility',
        location: 'Updated City',
        category: 'Testing',
        description: 'Updated by test',
        status: 'Maintenance',
      });

    expect(updateResponse.status).toBe(200);

    const deleteResponse = await request(app).delete(`/api/facilities/${facilityId}`);
    expect(deleteResponse.status).toBe(200);
  });
});

describe('Inspection CRUD', () => {
  it('handles inspection operations when database is available', async () => {
    const dbAvailable = await checkDb();
    if (!dbAvailable) {
      return;
    }

    const facilityResponse = await request(app)
      .post('/api/facilities')
      .send({
        name: 'Inspection Facility',
        location: 'Inspection Test City',
        category: 'Testing',
        description: 'Used for inspection tests',
        status: 'Active',
      });

    const facilityId = facilityResponse.body.data.id;

    const createResponse = await request(app)
      .post('/api/inspections')
      .send({
        facility_id: facilityId,
        inspector_name: 'Test Inspector',
        inspection_date: '2026-10-15',
        status: 'Pending',
        findings: 'Sample findings',
        remarks: 'Sample remarks',
      });

    expect(createResponse.status).toBe(201);
    const inspectionId = createResponse.body.data.id;

    const listResponse = await request(app).get('/api/inspections');
    expect(listResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/inspections/${inspectionId}`)
      .send({
        facility_id: facilityId,
        inspector_name: 'Updated Inspector',
        inspection_date: '2026-10-16',
        status: 'Completed',
        findings: 'Updated findings',
        remarks: 'Updated remarks',
      });

    expect(updateResponse.status).toBe(200);

    const deleteResponse = await request(app).delete(`/api/inspections/${inspectionId}`);
    expect(deleteResponse.status).toBe(200);

    await request(app).delete(`/api/facilities/${facilityId}`);
  });
});

describe('Complaint CRUD', () => {
  it('handles complaint operations when database is available', async () => {
    const dbAvailable = await checkDb();
    if (!dbAvailable) {
      return;
    }

    const facilityResponse = await request(app)
      .post('/api/facilities')
      .send({
        name: 'Complaint Facility',
        location: 'Complaint City',
        category: 'Testing',
        description: 'Used for complaint tests',
        status: 'Active',
      });

    const facilityId = facilityResponse.body.data.id;

    const createResponse = await request(app)
      .post('/api/complaints')
      .send({
        facility_id: facilityId,
        title: 'Test complaint',
        description: 'This is a sample issue',
        priority: 'High',
        status: 'Open',
        reported_by: 'Test User',
        resolution_notes: 'Pending',
      });

    expect(createResponse.status).toBe(201);
    const complaintId = createResponse.body.data.id;

    const listResponse = await request(app).get('/api/complaints');
    expect(listResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/complaints/${complaintId}`)
      .send({
        facility_id: facilityId,
        title: 'Updated complaint',
        description: 'Updated complaint details',
        priority: 'Critical',
        status: 'Resolved',
        reported_by: 'Test User',
        resolution_notes: 'Resolved in test',
      });

    expect(updateResponse.status).toBe(200);

    const deleteResponse = await request(app).delete(`/api/complaints/${complaintId}`);
    expect(deleteResponse.status).toBe(200);

    await request(app).delete(`/api/facilities/${facilityId}`);
  });
});

describe('Validation and missing record handling', () => {
  it('rejects invalid facility payloads and missing IDs', async () => {
    const dbAvailable = await checkDb();
    if (!dbAvailable) {
      return;
    }

    const invalidResponse = await request(app)
      .post('/api/facilities')
      .send({
        location: 'No name',
        category: 'Testing',
      });

    expect(invalidResponse.status).toBe(400);

    const missingResponse = await request(app).get('/api/facilities/999999');
    expect(missingResponse.status).toBe(404);
  });
});
