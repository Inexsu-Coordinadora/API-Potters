CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS programaacademico (
    idprograma UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombreprograma VARCHAR(50) NOT NULL,
    niveleducativo VARCHAR(30) NOT NULL,
    modalidad VARCHAR(20) NOT NULL,
    duracionmeses SMALLINT NOT NULL,
);