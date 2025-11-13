CREATE TABLE IF NOT EXISTS periodoacademico (
    idperiodo SERIAL PRIMARY KEY,
    semestre VARCHAR(10) NOT NULL,
    fechainicio DATE NOT NULL,
    fechafin DATE NOT NULL,
    idestado INT NOT NULL,
    
   FOREIGN KEY (idestado) REFERENCES estadoperiodoacademico(idestado)
);