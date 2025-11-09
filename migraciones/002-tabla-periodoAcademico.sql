CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS periodoacademico (
    idperiodo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    semestre VARCHAR(10) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    estadoperiodo VARCHAR(20) NOT NULL,
);