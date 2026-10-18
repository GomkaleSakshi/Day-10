import pool from '../config/db.js';

export const listFacilities = async (req, res, next) => {
  try {
    const { search = '', category = '', status = '' } = req.query;
    let query = 'SELECT * FROM facilities';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR location LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

export const getFacilityById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const createFacility = async (req, res, next) => {
  try {
    const { name, location, category, description, status } = req.body;

    const [result] = await pool.query(
      'INSERT INTO facilities (name, location, category, description, status) VALUES (?, ?, ?, ?, ?)',
      [name, location, category, description, status]
    );

    const [rows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Facility created successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const updateFacility = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, location, category, description, status } = req.body;

    const [existingRows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    await pool.query(
      'UPDATE facilities SET name = ?, location = ?, category = ?, description = ?, status = ? WHERE id = ?',
      [name, location, category, description || '', status || 'Active', id]
    );

    const [rows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Facility updated successfully.', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

export const deleteFacility = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [existingRows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Facility deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};
