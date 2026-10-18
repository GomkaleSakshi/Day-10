CREATE DATABASE IF NOT EXISTS smart_facility_db;
USE smart_facility_db;

CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT,
  status ENUM('Active', 'Inactive', 'Maintenance') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_facilities_status (status),
  INDEX idx_facilities_category (category),
  INDEX idx_facilities_location (location)
);

CREATE TABLE IF NOT EXISTS inspections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  inspector_name VARCHAR(150) NOT NULL,
  inspection_date DATE NOT NULL,
  status ENUM('Pending', 'In Progress', 'Completed', 'Failed') NOT NULL DEFAULT 'Pending',
  findings TEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inspections_facility
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  INDEX idx_inspections_facility (facility_id),
  INDEX idx_inspections_status (status),
  INDEX idx_inspections_date (inspection_date)
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  status ENUM('Open', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
  reported_by VARCHAR(150) NOT NULL,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_complaints_facility
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  INDEX idx_complaints_facility (facility_id),
  INDEX idx_complaints_status (status),
  INDEX idx_complaints_priority (priority)
);
