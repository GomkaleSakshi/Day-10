USE smart_facility_db;

INSERT INTO facilities (name, location, category, description, status) VALUES
('Main Administration Block', 'Bengaluru', 'Administrative', 'Primary administrative facility with offices, reception, and meeting halls.', 'Active'),
('Power House Unit 1', 'Bengaluru', 'Utilities', 'Critical electrical generation and backup power operations center.', 'Maintenance'),
('Water Treatment Plant', 'Hyderabad', 'Utilities', 'Water processing and supply unit for campus operations.', 'Active'),
('North Campus Building', 'Pune', 'Educational', 'Academic building housing classrooms and faculty offices.', 'Active'),
('South Service Center', 'Chennai', 'Support', 'Vehicle and facility support operations for all departments.', 'Inactive');

INSERT INTO inspections (facility_id, inspector_name, inspection_date, status, findings, remarks) VALUES
(1, 'Aarav Sharma', '2026-10-01', 'Completed', 'Administrative systems working well. Minor signage updates needed.', 'Follow-up on signage correction next quarter.'),
(2, 'Priya Nair', '2026-10-02', 'In Progress', 'Generator performance under observation. Cooling system needs review.', 'Pending vendor inspection.'),
(3, 'Mehul Verma', '2026-10-04', 'Pending', 'Water pressure calibration due for review.', 'Awaiting maintenance team approval.'),
(4, 'Sonia Kapoor', '2026-10-09', 'Completed', 'Classroom safety checks passed with minor housekeeping observations.', 'No critical issues found.'),
(5, 'Karan Khanna', '2026-10-11', 'Failed', 'Service center safety check failed due to blocked exits and missing extinguisher logs.', 'Immediate corrective action required.');

INSERT INTO complaints (facility_id, title, description, priority, status, reported_by, resolution_notes) VALUES
(1, 'Broken Lobby AC', 'The lobby air conditioning unit is not cooling properly during peak hours.', 'High', 'In Progress', 'Rita Menon', 'Maintenance scheduled for compressor review.'),
(2, 'Backup Generator Noise', 'Generator emits unusual vibration and noise during routine testing.', 'Critical', 'Open', 'Vikram Joshi', 'Awaiting service vendor response.'),
(3, 'Low Water Pressure', 'Multiple floors are experiencing reduced water pressure during early morning hours.', 'Medium', 'Resolved', 'Sunil Rao', 'Pressure valve replaced and pressure normalized.'),
(4, 'Classroom Lighting Issue', 'Two classrooms have intermittent lighting failures during evening classes.', 'High', 'Closed', 'Ananya Singh', 'Fluorescent fixtures replaced and checked.'),
(5, 'Unsafe Parking Area', 'Service center parking lot has poor lighting and inadequate signage.', 'Medium', 'Open', 'Nishant Roy', 'Safety review pending with facilities team.');
