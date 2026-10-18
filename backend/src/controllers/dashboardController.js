import pool from '../config/db.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [facilitySummary] = await pool.query(
      'SELECT COUNT(*) AS total_facilities, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS active_facilities, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS maintenance_facilities FROM facilities',
      ['Active', 'Maintenance']
    );

    const [inspectionSummary] = await pool.query(
      'SELECT COUNT(*) AS total_inspections, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS pending_inspections, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS completed_inspections FROM inspections',
      ['Pending', 'Completed']
    );

    const [complaintSummary] = await pool.query(
      'SELECT COUNT(*) AS total_complaints, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS open_complaints, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS resolved_complaints FROM complaints',
      ['Open', 'Resolved']
    );

    const [facilityStatusChart] = await pool.query(
      'SELECT status, COUNT(*) AS value FROM facilities GROUP BY status ORDER BY status'
    );

    const [inspectionStatusChart] = await pool.query(
      'SELECT status, COUNT(*) AS value FROM inspections GROUP BY status ORDER BY status'
    );

    const [complaintPrioritySummary] = await pool.query(
      'SELECT priority, COUNT(*) AS value FROM complaints GROUP BY priority ORDER BY FIELD(priority, ' + "'Low','Medium','High','Critical'" + ')'
    );

    const [recentInspections] = await pool.query(
      `SELECT i.id, i.inspection_date, i.status, i.inspector_name, f.name AS facility_name
       FROM inspections i
       LEFT JOIN facilities f ON f.id = i.facility_id
       ORDER BY i.inspection_date DESC, i.id DESC
       LIMIT 5`
    );

    const [recentComplaints] = await pool.query(
      `SELECT c.id, c.title, c.priority, c.status, c.created_at, f.name AS facility_name
       FROM complaints c
       LEFT JOIN facilities f ON f.id = c.facility_id
       ORDER BY c.created_at DESC, c.id DESC
       LIMIT 5`
    );

    const response = {
      success: true,
      stats: {
        totalFacilities: Number(facilitySummary[0]?.total_facilities || 0),
        activeFacilities: Number(facilitySummary[0]?.active_facilities || 0),
        maintenanceFacilities: Number(facilitySummary[0]?.maintenance_facilities || 0),
        totalInspections: Number(inspectionSummary[0]?.total_inspections || 0),
        pendingInspections: Number(inspectionSummary[0]?.pending_inspections || 0),
        completedInspections: Number(inspectionSummary[0]?.completed_inspections || 0),
        totalComplaints: Number(complaintSummary[0]?.total_complaints || 0),
        openComplaints: Number(complaintSummary[0]?.open_complaints || 0),
        resolvedComplaints: Number(complaintSummary[0]?.resolved_complaints || 0),
      },
      facilityStatusChart,
      inspectionStatusChart,
      complaintPrioritySummary,
      recentInspections,
      recentComplaints,
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};
