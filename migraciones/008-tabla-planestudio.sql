CREATE TABLE IF NOT EXISTS planestudio (
    idplanestudio SERIAL PRIMARY KEY,
    idprograma INT NOT NULL,
    idasignatura INT NOT NULL,
    semestre SMALLINT NOT NULL,
    creditos SMALLINT NOT NULL,

    FOREIGN KEY (idprograma) REFERENCES programaacademico(idprograma),
    FOREIGN KEY (idasignatura) REFERENCES asignatura(idasignatura)
);