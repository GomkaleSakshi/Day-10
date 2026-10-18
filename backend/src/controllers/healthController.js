import pool from '../config/db.js';

export const getHealth = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({
      success: true,
      status: 'ok',
      message: 'Backend is running and database is reachable.',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      status: 'error',
      message: 'Database connection failed. Please configure MySQL and the DB_* environment variables in backend/.env.',
      error: error.message,
    });
  }
};
