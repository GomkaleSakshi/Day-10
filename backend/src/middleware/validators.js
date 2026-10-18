const validateRequiredString = (value, fieldName) => {
  if (typeof value !== 'string' || !value.trim()) {
    return `${fieldName} is required.`;
  }
  return null;
};

export const ensurePositiveId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'A valid positive numeric ID is required.' });
  }
  next();
};

export const validateFacility = (req, res, next) => {
  const { name, location, category, status } = req.body || {};

  const requiredErrors = [
    validateRequiredString(name, 'Facility name'),
    validateRequiredString(location, 'Location'),
    validateRequiredString(category, 'Category'),
  ].filter(Boolean);

  if (requiredErrors.length) {
    return res.status(400).json({ success: false, message: requiredErrors[0] });
  }

  const validStatuses = ['Active', 'Inactive', 'Maintenance'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be one of Active, Inactive, or Maintenance.' });
  }

  req.body.name = name.trim();
  req.body.location = location.trim();
  req.body.category = category.trim();
  req.body.description = (req.body.description || '').trim();
  req.body.status = status || 'Active';

  next();
};

export const validateInspection = (req, res, next) => {
  const { facility_id, inspector_name, inspection_date, status } = req.body || {};

  if (!Number.isInteger(Number(facility_id)) || Number(facility_id) <= 0) {
    return res.status(400).json({ success: false, message: 'A valid facility_id is required.' });
  }

  const inspectorError = validateRequiredString(inspector_name, 'Inspector name');
  if (inspectorError) {
    return res.status(400).json({ success: false, message: inspectorError });
  }

  if (!inspection_date || !Date.parse(inspection_date)) {
    return res.status(400).json({ success: false, message: 'Inspection date is required and must be valid.' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Failed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be one of Pending, In Progress, Completed, or Failed.' });
  }

  req.body.facility_id = Number(facility_id);
  req.body.inspector_name = inspector_name.trim();
  req.body.status = status || 'Pending';
  req.body.findings = (req.body.findings || '').trim();
  req.body.remarks = (req.body.remarks || '').trim();

  next();
};

export const validateComplaint = (req, res, next) => {
  const { facility_id, title, description, priority, status, reported_by } = req.body || {};

  if (!Number.isInteger(Number(facility_id)) || Number(facility_id) <= 0) {
    return res.status(400).json({ success: false, message: 'A valid facility_id is required.' });
  }

  const titleError = validateRequiredString(title, 'Complaint title');
  const descriptionError = validateRequiredString(description, 'Complaint description');
  const reporterError = validateRequiredString(reported_by, 'Reported by');

  if (titleError) return res.status(400).json({ success: false, message: titleError });
  if (descriptionError) return res.status(400).json({ success: false, message: descriptionError });
  if (reporterError) return res.status(400).json({ success: false, message: reporterError });

  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, High, or Critical.' });
  }

  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be one of Open, In Progress, Resolved, or Closed.' });
  }

  req.body.facility_id = Number(facility_id);
  req.body.title = title.trim();
  req.body.description = description.trim();
  req.body.priority = priority || 'Medium';
  req.body.status = status || 'Open';
  req.body.reported_by = reported_by.trim();
  req.body.resolution_notes = (req.body.resolution_notes || '').trim();

  next();
};
