CREATE TABLE IF NOT EXISTS oferta (
    idoferta SERIAL PRIMARY KEY,
    idprograma INT NOT NULL,
    idperiodo INT NOT NULL,
    idasignatura NOT NULL,
    grupo SMALLINT NOT NULL,
    cupo SMALLINT NOT NULL,

    FOREIGN KEY (idprograma) REFERENCES programaacademico(idprograma),
    FOREIGN KEY (idperiodo) REFERENCES periodoacademico(idperiodo),
    FOREIGN KEY (idasignatura) REFERENCES asignatura(idasignatura)
);
