import pool from '../config/db.js';

export const listInspections = async (req, res, next) => {
  try {
    const { facility_id = '', status = '', date = '' } = req.query;
    let query = `
      SELECT i.*, f.name AS facility_name
      FROM inspections i
      LEFT JOIN facilities f ON f.id = i.facility_id
    `;
    const params = [];
    const conditions = [];

    if (facility_id) {
      conditions.push('i.facility_id = ?');
      params.push(Number(facility_id));
    }

    if (status) {
      conditions.push('i.status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('DATE(i.inspection_date) = ?');
      params.push(date);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY i.inspection_date DESC, i.id DESC';

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

export const getInspectionById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT i.*, f.name AS facility_name
       FROM inspections i
       LEFT JOIN facilities f ON f.id = i.facility_id
       WHERE i.id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Inspection not found.' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const createInspection = async (req, res, next) => {
  try {
    const { facility_id, inspector_name, inspection_date, status, findings, remarks } = req.body;

    const [facilityRows] = await pool.query('SELECT id FROM facilities WHERE id = ?', [facility_id]);
    if (!facilityRows.length) {
      return res.status(400).json({ success: false, message: 'Facility not found. Please select a valid facility.' });
    }

    const [result] = await pool.query(
      `INSERT INTO inspections (facility_id, inspector_name, inspection_date, status, findings, remarks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [facility_id, inspector_name, inspection_date, status, findings || '', remarks || '']
    );

    const [rows] = await pool.query(
      `SELECT i.*, f.name AS facility_name
       FROM inspections i
       LEFT JOIN facilities f ON f.id = i.facility_id
       WHERE i.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ success: true, message: 'Inspection created successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const updateInspection = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { facility_id, inspector_name, inspection_date, status, findings, remarks } = req.body;

    const [existingRows] = await pool.query('SELECT * FROM inspections WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Inspection not found.' });
    }

    const [facilityRows] = await pool.query('SELECT id FROM facilities WHERE id = ?', [facility_id]);
    if (!facilityRows.length) {
      return res.status(400).json({ success: false, message: 'Facility not found. Please select a valid facility.' });
    }

    await pool.query(
      `UPDATE inspections
       SET facility_id = ?, inspector_name = ?, inspection_date = ?, status = ?, findings = ?, remarks = ?
       WHERE id = ?`,
      [facility_id, inspector_name, inspection_date, status, findings || '', remarks || '', id]
    );

    const [rows] = await pool.query(
      `SELECT i.*, f.name AS facility_name
       FROM inspections i
       LEFT JOIN facilities f ON f.id = i.facility_id
       WHERE i.id = ?`,
      [id]
    );

    return res.status(200).json({ success: true, message: 'Inspection updated successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const deleteInspection = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [existingRows] = await pool.query('SELECT * FROM inspections WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Inspection not found.' });
    }

    await pool.query('DELETE FROM inspections WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Inspection deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};
