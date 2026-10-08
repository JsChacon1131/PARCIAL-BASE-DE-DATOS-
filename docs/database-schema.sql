CREATE DATABASE IF NOT EXISTS db_patrimonio;
CREATE DATABASE IF NOT EXISTS db_reservas;

CREATE TABLE IF NOT EXISTS db_patrimonio.administrative_dependency (
  dependency_id INT AUTO_INCREMENT PRIMARY KEY,
  dependency_name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS db_patrimonio.cultural_space (
  cultural_space_id INT AUTO_INCREMENT PRIMARY KEY,
  space_name VARCHAR(150) NOT NULL,
  address VARCHAR(255),
  max_capacity INT NOT NULL,
  conservation_status VARCHAR(80) NOT NULL,
  operational_status VARCHAR(80) NOT NULL,
  dependency_id INT NOT NULL,
  FOREIGN KEY (dependency_id) REFERENCES db_patrimonio.administrative_dependency(dependency_id)
);

CREATE TABLE IF NOT EXISTS db_reservas.organization (
  organization_id INT AUTO_INCREMENT PRIMARY KEY,
  organization_name VARCHAR(150) NOT NULL,
  contact_email VARCHAR(150) NOT NULL,
  phone VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS db_reservas.reservation (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  cultural_space_id INT NOT NULL,
  organization_id INT NOT NULL,
  requested_capacity INT NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reservation_status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (organization_id) REFERENCES db_reservas.organization(organization_id),
  INDEX idx_reservation_schedule (cultural_space_id, reservation_date, reservation_status)
);

-- cultural_space_id corresponde a un registro en db_patrimonio.cultural_space.
-- Su existencia y capacidad se validan desde la aplicación al usar dos bases de datos.
