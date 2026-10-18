import pool from '../config/db.js';

export const listComplaints = async (req, res, next) => {
  try {
    const { facility_id = '', status = '', priority = '', search = '' } = req.query;
    let query = `
      SELECT c.*, f.name AS facility_name
      FROM complaints c
      LEFT JOIN facilities f ON f.id = c.facility_id
    `;
    const params = [];
    const conditions = [];

    if (facility_id) {
      conditions.push('c.facility_id = ?');
      params.push(Number(facility_id));
    }

    if (status) {
      conditions.push('c.status = ?');
      params.push(status);
    }

    if (priority) {
      conditions.push('c.priority = ?');
      params.push(priority);
    }

    if (search) {
      conditions.push('(c.title LIKE ? OR c.description LIKE ? OR c.reported_by LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC, c.id DESC';

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT c.*, f.name AS facility_name
       FROM complaints c
       LEFT JOIN facilities f ON f.id = c.facility_id
       WHERE c.id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    const { facility_id, title, description, priority, status, reported_by, resolution_notes } = req.body;

    const [facilityRows] = await pool.query('SELECT id FROM facilities WHERE id = ?', [facility_id]);
    if (!facilityRows.length) {
      return res.status(400).json({ success: false, message: 'Facility not found. Please select a valid facility.' });
    }

    const [result] = await pool.query(
      `INSERT INTO complaints (facility_id, title, description, priority, status, reported_by, resolution_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [facility_id, title, description, priority, status, reported_by, resolution_notes || '']
    );

    const [rows] = await pool.query(
      `SELECT c.*, f.name AS facility_name
       FROM complaints c
       LEFT JOIN facilities f ON f.id = c.facility_id
       WHERE c.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ success: true, message: 'Complaint created successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { facility_id, title, description, priority, status, reported_by, resolution_notes } = req.body;

    const [existingRows] = await pool.query('SELECT * FROM complaints WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const [facilityRows] = await pool.query('SELECT id FROM facilities WHERE id = ?', [facility_id]);
    if (!facilityRows.length) {
      return res.status(400).json({ success: false, message: 'Facility not found. Please select a valid facility.' });
    }

    await pool.query(
      `UPDATE complaints
       SET facility_id = ?, title = ?, description = ?, priority = ?, status = ?, reported_by = ?, resolution_notes = ?
       WHERE id = ?`,
      [facility_id, title, description, priority, status, reported_by, resolution_notes || '', id]
    );

    const [rows] = await pool.query(
      `SELECT c.*, f.name AS facility_name
       FROM complaints c
       LEFT JOIN facilities f ON f.id = c.facility_id
       WHERE c.id = ?`,
      [id]
    );

    return res.status(200).json({ success: true, message: 'Complaint updated successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [existingRows] = await pool.query('SELECT * FROM complaints WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    await pool.query('DELETE FROM complaints WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Complaint deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};
