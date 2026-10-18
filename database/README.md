# Database Setup

This project uses MySQL as the primary database. The database name must be `smart_facility_db`.

## 1. Create the database

```bash
mysql -u root -p
CREATE DATABASE smart_facility_db;
```

## 2. Import the schema

```bash
mysql -u root -p smart_facility_db < database/schema.sql
```

## 3. Import sample data

```bash
mysql -u root -p smart_facility_db < database/seed.sql
```

## 4. Verify tables

```bash
mysql -u root -p
USE smart_facility_db;
SHOW TABLES;
DESCRIBE facilities;
DESCRIBE inspections;
DESCRIBE complaints;
```

## 5. Environment values

Use the same values in backend/.env.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_facility_db
```

If MySQL is not available in this environment, install it locally and run the SQL files before starting the backend.
