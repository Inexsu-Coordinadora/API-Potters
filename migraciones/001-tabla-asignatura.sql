CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS asignatura (
    idasignatura UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombreasignatura VARCHAR(50) NOT NULL,
    creditos SMALLINT NOT NULL,
    cargahoraria VARCHAR(10) NOT NULL,
    formatoclase VARCHAR(20) NOT NULL,
    informacion TEXT NULL,
);