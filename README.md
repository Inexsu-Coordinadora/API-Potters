Autores: Santiago Barrera, Jefferson Perdomo Patiño, Juliana Perez muñoz
Versión: 1.0
Grupo: API Potters
Proyecto: Academium
Base de datos: PostgreSQL
Framework: Fastify + Node.js

🧱 Descripción general:
En esta primera entrega del proyecto Academium se crearon las tablas principales de la base de datos:

asignatura
periodoacademico
programaacademico

Estas tablas, por el momento, no tienen relaciones entre sí, por lo que esta versión contiene únicamente los CRUDs independientes para cada una.

## ##############################################################################################################

📘 API — CRUD de Asignaturas

Autor: Santiago Barrera
Versión: 1.0

📂 Tabla: asignatura

A continuación, se documenta el CRUD completo de la tabla asignatura.

| Campo              | Tipo           | Descripción                                                  |
| :----------------- | :------------- | :----------------------------------------------------------- |
| `idAsignatura`     | `serial` (PK)  | Identificador único de la asignatura                         |
| `nombreAsignatura` | `varchar(100)` | Nombre de la asignatura                                      |
| `creditos`         | `int`          | Cantidad de créditos académicos                              |
| `cargaHoraria`     | `varchar(20)`  | Carga horaria semanal (por ejemplo, “6 hr/s”)                |
| `formatoClase`     | `varchar(50)`  | Modalidad de la clase (“teórica”, “práctica”, “mixta”, etc.) |
| `informacion`      | `text`         | Descripción breve o información adicional                    |

⚙️ Endpoints disponibles
La ruta base para este módulo es: http://127.0.0.1:3001/api/Academium/asignaturas

1️⃣ Crear una asignatura (POST)

Endpoint:
POST /api/Academium/asignaturas

Cuerpo (JSON):

{
  "nombreAsignatura": "Estadística",
  "creditos": 4,
  "cargaHoraria": "6 hr/s",
  "formatoClase": "Teórica",
  "informacion": "Estadística básica"
}

✅ Respuesta exitosa:

{
  "mensaje": "La asignatura: Estadística se creó correctamente"
}

❌ Respuesta con error:

{
  "mensaje": "Error al crear una nueva asignatura",
  "error": "Invalid input: expected string, received undefined"
}

2️⃣ Consultar todas las asignaturas (GET)

Endpoint:
GET /api/Academium/asignaturas

✅ Respuesta exitosa:

{
  "mensaje": "Asignaturas encontradas correctamente",
  "Asignaturas": [
    {
      "idAsignatura": 1,
      "nombreAsignatura": "Matemáticas",
      "creditos": 3,
      "cargaHoraria": "4 hr/s",
      "formatoClase": "Teórica",
      "informacion": "Cálculo diferencial"
    }
  ],
  "AsignaturasEncontradas": 1
}

❌ Respuesta con error:

{
  "mensaje": "Error al obtener las asignaturas",
  "error": "Invalid input: expected string, received undefined"
}

3️⃣ Consultar asignatura por ID (GET)

Endpoint:
GET /api/Academium/asignaturas/:idAsignatura

Parámetro:
idAsignatura → número entero (por ejemplo: 8)

✅ Respuesta exitosa:

{
  "mensaje": "Asignatura encontrada correctamente",
  "Asignatura": {
    "idAsignatura": 8,
    "nombreAsignatura": "Estadística",
    "creditos": 4,
    "cargaHoraria": "6 hr/s",
    "formatoClase": "Teórica",
    "informacion": "Estadística básica"
  }
}

⚠️ Si el ID no existe:

{
  "mensaje": "Asignatura no encontrada"
}

❌ Error general:
{
  "mensaje": "Error al obtener la asignatura",
  "error": "Invalid input: expected string, received undefined"
}

❌ Error de tipo de parámetro:

{
  "mensaje": "Error al obtener la Asignatura",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}

4️⃣ Actualizar asignatura por ID (PUT)

Endpoint:
PUT /api/Academium/asignaturas/:idAsignatura

Cuerpo (JSON):

{
  "nombreAsignatura": "Estadística",
  "creditos": 4,
  "cargaHoraria": "6 hr/s",
  "formatoClase": "Teórica",
  "informacion": "Estadística avanzada"
}

✅ Respuesta exitosa:

{
  "mensaje": "Asignatura actualizada correctamente",
  "AsignaturaActualizada": {
    "idAsignatura": 9,
    "nombreAsignatura": "Estadística",
    "creditos": 4,
    "cargaHoraria": "6 hr/s",
    "formatoClase": "Teórica",
    "informacion": "Estadística avanzada"
  }
}

⚠️ Si el ID no existe:

{
  "mensaje": "Asignatura no encontrada"
}

❌ Error general:
{
  "mensaje": "Error al actualizar la asignatura",
  "error": "Invalid input: expected string, received undefined"
}

❌ Error de tipo de parámetro:

{
  "mensaje": "Error al actualizar la asignatura",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}

5️⃣ Eliminar asignatura por ID (DELETE)

Endpoint:
DELETE /api/Academium/asignaturas/:idAsignatura

Parámetro:
idAsignatura → número entero (por ejemplo: 8)

✅ Respuesta exitosa:

{
  "mensaje": "Asignatura eliminada correctamente",
  "idAsignatura": "8"
}

⚠️ Si el ID no existe:

{
  "mensaje": "Asignatura no encontrada"
}

❌ Error de tipo de parámetro:

{
  "mensaje": "Error al eliminar la asignatura",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}

🧩 Observaciones y recomendaciones

- Todos los endpoints retornan un objeto JSON como respuesta.
- En caso de error, se incluye siempre una propiedad "error" para facilitar el diagnóstico.
- Se recomienda validar en el cliente que los parámetros sean del tipo correcto antes de enviar las solicitudes.
- Actualmente no hay relaciones entre tablas; en futuras entregas se incluirán claves foráneas y endpoints con JOIN o populate.

🚀 Próximos pasos

- Establecer relaciones entre asignatura, programaacademico y periodoacademico.
- Implementar la lógica en los casos de uso.

## ##############################################################################################################

Autor: Juliana Perez Muñoz
Versión: 1.0


📂 Tabla: periodo académico


A continuación, se documenta el CRUD completo de la tabla periodo académico.




Campo
Tipo
Descripción
idPeriodo
serial (PK)
Identificador único del periodo académico
semestre
varchar(10)
Número o nombre del semestre (por ejemplo, “2025-1”)
fechaInicio
date
Fecha de inicio del periodo académico
fechaFin
date
Fecha de finalización del periodo académico
estadoPeriodo
varchar(20)
Estado actual del periodo (“Activo”, “Finalizado”)





⚙️ Endpoints disponibles
La ruta base para este módulo es: http://127.0.0.1:3001/api/Academium/periodoacademico


1️⃣ Crear un periodo académico (POST)
Endpoint:
 POST /api/Academium/periodos
Cuerpo (JSON):
{
  "semestre": "2025-1",
  "fechaInicio": "2025-02-01",
  "fechaFin": "2025-06-30",
  "estadoPeriodo": "Activo"
}

✅ Respuesta exitosa:
{
  "mensaje": "El periodo académico 2025-1 se creó correctamente"
}

❌ Respuesta con error:
{
  "mensaje": "Error al crear un nuevo periodo académico",
  "error": "Invalid input: expected string, received undefined"
}


2️⃣ Consultar todos los periodos académicos (GET)
Endpoint:
 GET /api/Academium/periodoacademico
✅ Respuesta exitosa:
{
  "mensaje": "Periodos académicos encontrados correctamente",
  "Periodos": [
    {
      "idPeriodo": 1,
      "semestre": "2024-2",
      "fechaInicio": "2024-08-01",
      "fechaFin": "2024-12-20",
      "estadoPeriodo": "Finalizado"
    }
  ],
  "PeriodosEncontrados": 1
}

❌ Respuesta con error:
{
  "mensaje": "Error al obtener los periodos académicos",
  "error": "Invalid input: expected string, received undefined"
}


3️⃣ Consultar periodo académico por ID (GET)
Endpoint:
 GET /api/Academium/periodoacademico/:idPeriodo
Parámetro:
 idPeriodo → número entero (por ejemplo: 3)
✅ Respuesta exitosa:
{
  "mensaje": "Periodo académico encontrado correctamente",
  "Periodo": {
    "idPeriodo": 3,
    "semestre": "2025-1",
    "fechaInicio": "2025-02-01",
    "fechaFin": "2025-06-30",
    "estadoPeriodo": "Activo"
  }
}

⚠️ Si el ID no existe:
{
  "mensaje": "Periodo académico no encontrado"
}

❌ Error general:
{
  "mensaje": "Error al obtener el periodo académico",
  "error": "Invalid input: expected string, received undefined"
}

❌ Error de tipo de parámetro:
{
  "mensaje": "Error al obtener el periodo académico",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}


4️⃣ Actualizar periodo académico por ID (PUT)
Endpoint:
 PUT /api/Academium/periodoacademico/:idPeriodo
Cuerpo (JSON):
{
  "semestre": "2025-1",
  "fechaInicio": "2025-02-01",
  "fechaFin": "2025-06-30",
  "estadoPeriodo": "Finalizado"
}

✅ Respuesta exitosa:
{
  "mensaje": "Periodo académico actualizado correctamente",
  "PeriodoActualizado": {
    "idPeriodo": 3,
    "semestre": "2025-1",
    "fechaInicio": "2025-02-01",
    "fechaFin": "2025-06-30",
    "estadoPeriodo": "Finalizado"
  }
}

⚠️ Si el ID no existe:
{
  "mensaje": "Periodo académico no encontrado"
}

❌ Error general:
{
  "mensaje": "Error al actualizar el periodo académico",
  "error": "Invalid input: expected string, received undefined"
}

❌ Error de tipo de parámetro:
{
  "mensaje": "Error al actualizar el periodo académico",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}


5️⃣ Eliminar periodo académico por ID (DELETE)
Endpoint:
 DELETE /api/Academium/periodoacademico/:idPeriodo
Parámetro:
 idPeriodo → número entero (por ejemplo: 3)
✅ Respuesta exitosa:
{
  "mensaje": "Periodo académico eliminado correctamente",
  "idPeriodo": "3"
}

⚠️ Si el ID no existe:
{
  "mensaje": "Periodo académico no encontrado"
}

❌ Error de tipo de parámetro:
{
  "mensaje": "Error al eliminar el periodo académico",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}

## ################################################################################################################

Autor: Jefferson Perdomo Patiño
Versión: 1.0


📂 Tabla: programa


A continuación, se documenta el CRUD completo de la tabla programa.

| Campo           | Tipo           | Descripción                                                   |
| :--------------- | :-------------- | :------------------------------------------------------------ |
| idPrograma     | serial (PK)   | Identificador único del programa                              |
| nombrePrograma | varchar(100)  | Nombre del programa                                           |
| nivelEducativo | varchar(100)  | Nivel educativo del programa (por ejemplo, “Pregrado”)        |
| modalidad      | varchar(100)  | Modalidad del programa (por ejemplo, “Presencial”)            |
| duracionMeses  | smallint      | Duración del programa en meses  

⚙️ Endpoints disponibles
La ruta base para este módulo es: http://127.0.0.1:3000/api/Academium/programas


1️⃣ Crear una asignatura (POST)


Endpoint:
POST /api/Academium/programa


Cuerpo (JSON):

{
  "nombrePrograma": "Ingeniera Electrica",
  "nivelEducativo": "pregado",
  "modalidad": "presencial",
  "duracionMeses": "60"
}


✅ Respuesta exitosa:

{
  "mensaje": "El programa se creó correctamente"
}


❌ Respuesta con error:


{
  "mensaje": "Error al crear un nuevo programa",
  "error": "Invalid input: expected string, received undefined"
}


2️⃣ Consultar todas las asignaturas (GET)


Endpoint:
GET /api/Academium/programas


✅ Respuesta exitosa:

{
  "mensaje": "Programas encontrados correctamente",
  "Programas": [
    {
      "idprograma": 1,
      "nombreprograma": "ingeniería sistemas",
      "niveleducativo": "pregrado",
      "modalidad": "virtual",
      "duracionmeses": 60
    },
    {
      "idprograma": 2,
      "nombreprograma": "ingeniería biomédica",
      "niveleducativo": "pregrado",
      "modalidad": "presencial",
      "duracionmeses": 60
    },
    {
      "idprograma": 3,
      "nombreprograma": "ingeniería mecatrónica",
      "niveleducativo": "pregrado",
      "modalidad": "mixta",
      "duracionmeses": 60
    },
    {
      "idprograma": 4,
      "nombreprograma": "tecnología en sistemas",
      "niveleducativo": "tecnología",
      "modalidad": "virtual",
      "duracionmeses": 24
    },
    {
      "idprograma": 5,
      "nombreprograma": "maestría en sistemas",
      "niveleducativo": "posgrado",
      "modalidad": "presencial",
      "duracionmeses": 24
    }
  ],
  "ProgramasEncontrados": 5
}


❌ Respuesta con error:


{
  "mensaje": "Error al obtener los programas",
  "error": "Invalid input: expected string, received undefined"
}


3️⃣ Consultar programa por ID (GET)


Endpoint:
GET /api/Academium/programas/:idProgramas


Parámetro:
idPrograma → número entero (por ejemplo: 1)


✅ Respuesta exitosa:
{
  "mensaje": "Programa encontrado correctamente",
  "Programa": {
    "idprograma": 1,
    "nombreprograma": "ingeniería sistemas",
    "niveleducativo": "pregrado",
    "modalidad": "virtual",
    "duracionmeses": 60
  }
}

⚠️ Si el ID no existe:


{
  "mensaje": "Programa no encontrada"
}


❌ Error general:
{
  "mensaje": "Error al obtener el programa",
  "error": "Invalid input: expected string, received undefined"
}


❌ Error de tipo de parámetro:


{
  "mensaje": "Error al obtener el programa",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}


4️⃣ Actualizar asignatura por ID (PUT)


Endpoint:
PUT /api/Academium/programa/:idPrograma


Cuerpo (JSON):


{
  "nombrePrograma": "ingeniera industrial",
  "nivelEducativo": "pregrado",
  "modalidad": "presencial",
  "duracionMeses": "60"
}

✅ Respuesta exitosa:


{
  "mensaje": "Programa actualizado correctamente",
  "programaActualizado": {
    "idprograma": 10,
    "nombreprograma": "ingeniera industrial",
    "niveleducativo": "pregrado",
    "modalidad": "presencial",
    "duracionmeses": 60
  }
}

⚠️ Si el ID no existe:


{
  "mensaje": "Programa no encontrado"
}


❌ Error general:
{
  "mensaje": "Error al actualizar el programa",
  "error": "Invalid input: expected string, received undefined"
}


❌ Error de tipo de parámetro:


{
  "mensaje": "Error al actualizar el programa",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}


5️⃣ Eliminar asignatura por ID (DELETE)


Endpoint:
DELETE /api/Academium/programas/:idPrograma


Parámetro:
idPrograma → número entero (por ejemplo: 10)


✅ Respuesta exitosa:


{
  "mensaje": "Programa eliminado correctamente",
  "idAsignatura": "10"
}


⚠️ Si el ID no existe:


{
  "mensaje": "Programa no encontrada"
}


❌ Error de tipo de parámetro:


{
  "mensaje": "Error al eliminar el programa",
  "error": "La sintaxis de entrada no es válida para tipo integer: «s»"
}


🧩 Observaciones y recomendaciones


- Todos los endpoints retornan un objeto JSON como respuesta.
- En caso de error, se incluye siempre una propiedad "error" para facilitar el diagnóstico.
- Se recomienda validar en el cliente que los parámetros sean del tipo correcto antes de enviar las solicitudes.
- Actualmente no hay relaciones entre tablas; en futuras entregas se incluirán claves foráneas y endpoints con JOIN o populate.


🚀 Próximos pasos


- Establecer relaciones entre asignatura, programaacademico y periodoacademico.
- Implementar la lógica en los casos de uso. 