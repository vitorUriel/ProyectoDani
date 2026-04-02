/* Aqui va el codigo de la base de datos,,ya que si tenemos datos diferentes 
no funcionaria la aplicacion*/


-- 1. Crear Base de Datos
CREATE DATABASE IF NOT EXISTS sistema_tickets;
USE sistema_tickets;

-- 2. Tabla de Roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL -- Ej: 'Admin General', 'Admin Area', 'Usuario'
);

-- 3. Tabla de Departamentos
CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL -- Ej: 'Soporte', 'Mantenimiento', etc.
);

-- 4. Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    departamento_id INT DEFAULT NULL, -- NULL si es Admin General o Usuario normal
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

-- 5. Tabla de Tickets
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL,         -- Ej: 'Fuga de agua', 'Puerta rota'
    ubicacion VARCHAR(150) NOT NULL,   -- Ej: 'Aula 3', 'Oficina'
    estado ENUM('Pendiente', 'En proceso', 'Terminado') DEFAULT 'Pendiente',
    prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
    usuario_id INT NOT NULL,           -- Quién pide el servicio
    departamento_id INT NOT NULL,      -- A qué área se le pide
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

-- INSERCIONES BÁSICAS (Para que todos tengan datos con qué probar)
INSERT INTO roles (nombre) VALUES ('Admin General'), ('Admin Area'), ('Usuario');
INSERT INTO departamentos (nombre) VALUES ('Mantenimiento'), ('Limpieza'), ('Jardinería'), ('Soporte');

INSERT INTO usuarios (nombre, correo, password, rol_id, departamento_id) VALUES
('Juan Perez', 'juan@example.com', '123456', 1, NULL),
('Maria Lopez', 'maria@example.com', '123456', 2, 1);

INSERT INTO tickets (descripcion, ubicacion, estado, prioridad, usuario_id, departamento_id) 
VALUES 
('Fuga de agua en el lavabo', 'Baños principales', 'Pendiente', 'Alta', 1, 1),
('Proyector no enciende', 'Aula 3', 'En proceso', 'Media', 1, 1);