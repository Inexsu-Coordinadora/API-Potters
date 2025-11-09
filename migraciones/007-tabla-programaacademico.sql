CREATE TABLE IF NOT EXISTS programaacademico (
    idprograma SERIAL PRIMARY KEY,
    nombreprograma VARCHAR(50) NOT NULL,
    idnivel INT NOT NULL,
    idmodalidad INT NOT NULL,
    duracionmeses SMALLINT NOT NULL,
    
    FOREIGN KEY (idnivel) REFERENCES niveleducativo(idnivel),
    FOREIGN KEY (idmodalidad) REFERENCES modalidad(idmodalidad)
);