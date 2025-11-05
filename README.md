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


      