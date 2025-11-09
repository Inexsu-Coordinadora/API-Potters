CREATE TABLE IF NOT EXISTS asignatura (
    idasignatura SERIAL PRIMARY KEY,
    nombreasignatura VARCHAR(50) NOT NULL,
    cargahoraria VARCHAR(10) NOT NULL,
    idformato INT NOT NULL,
    informacion TEXT NULL,

    FOREIGN KEY (idformato) REFERENCES formatoasignatura(idformato)
);