CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS asignatura (
    idAsignatura UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombreAsignatura VARCHAR(50) NOT NULL,
    creditos SMALLINT NOT NULL,
    cargaHoraria VARCHAR(10) NOT NULL,
    formatoClase VARCHAR(20) NOT NULL,
    informacion TEXT NULL,
);