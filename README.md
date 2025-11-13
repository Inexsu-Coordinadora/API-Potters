📘 Entrega 2 — Gestión Académica Administrativa

Autores: Santiago Barrera, Jefferson Perdomo Patiño, Juliana Perez Muñoz
Versión: 2.0
Grupo: API Potters
Proyecto: Academium
Base de datos: PostgreSQL
Framework: Fastify + Node.js
Video del funcionamiento: https://youtu.be/1LShAWqkPJA

🧱 Descripción general

En esta segunda entrega del proyecto Academium, se amplió la funcionalidad de la gestión académica, incorporando validaciones completas y tres nuevos servicios relacionados con la planificación académica y la administración institucional.

Las tablas creadas en la Entrega 1 (Programa, Asignatura y Periodo Académico) ahora se integran mediante nuevas entidades y relaciones que permiten definir planes de estudio, gestionar periodos académicos con transiciones de estado, y ofrecer asignaturas en cada periodo.

🧱 Objetivo general

Desarrollar e implementar una API académica, que permita gestionar de manera eficiente los procesos administrativos y académicos de una institución educativa, abarcando la creación, consulta, actualización y eliminación de entidades clave como programas académicos, asignaturas, planes de estudio, períodos académicos y ofertas académicas, garantizando la integridad de los datos, la trazabilidad de la información y la correcta transición entre estados.


1️⃣ Servicio: Definición de Plan de Estudio (Programa ↔ Asignatura)

Autor: Juliana Perez Muñoz
Versión: 2.0
Ruta base: http://127.0.0.1:3001/api/Academium/planestudio

📋 Descripción

Permite vincular asignaturas a un programa académico, indicando el semestre y los créditos correspondientes dentro del plan de estudio.

⚙️ Validaciones

✅ Verifica existencia de Programa y Asignatura (error si alguno no existe).

✅ No permite duplicidad: una asignatura no puede repetirse dos veces en el mismo programa y semestre.

✅ Valida coherencia:

semestre debe ser entero positivo.

creditos debe ser mayor que 0.

📍 Endpoints

POST /api/Academium/planestudio
GET /api/Academium/planestudio **(Consultar todos)**
GET /api/Academium/planestudio/:idPlanestudio **(Consultar por ID)**
PUT /api/Academium/planestudio/:idPlanestudio
DELETE /api/Academium/planestudio/:idPlanestudio

❌ Errores posibles:

Programa o Asignatura inexistente.

Duplicidad (misma asignatura, programa y semestre).

Valores inválidos (semestre <= 0 o creditos <= 0).

2️⃣ Servicio: Gestión de Periodos Académicos (Apertura, Cierre y Transición de Estados)

Autor: Jefferson Perdomo Patiño
Versión: 2.0
Ruta base: http://127.0.0.1:3001/api/Academium/periodoacademico

📋 Descripción

Permite crear, abrir, cerrar o modificar periodos académicos, asegurando coherencia en las fechas y validez en las transiciones de estado.

⚙️ Validaciones

✅ fechaFin ≥ fechaInicio

✅ No se permite traslape de periodos activos.

✅ Transiciones válidas:

en preparación → activo

activo → cerrado

No permitido: cerrado → activo

📍 Endpoints

POST /api/Academium/periodoacademico
GET /api/Academium/periodoacademico **(Consultar todos)**
GET /api/Academium/periodoacademico/:idPeriodoacademico **(Consultar por ID)**
PUT /api/Academium/periodoacademico/:idPeriodoacademico
DELETE /api/Academium/periodoacademico/:idPeriodoacademico

❌ Errores posibles:

"Error al actualizar el periodo académico", "error": "Transición inválida"

Fechas inconsistentes (fechaFin < fechaInicio).

Traslape con otro periodo activo.

3️⃣ Servicio: Oferta de Asignaturas por Periodo (Periodo ↔ Programa ↔ Asignatura)

Autor: Santiago Barrera
Versión: 2.0
Ruta base: http://127.0.0.1:3001/api/Academium/oferta

📋 Descripción

Permite programar la oferta académica de un periodo, creando grupos o secciones de una asignatura vinculadas a un programa.

⚙️ Validaciones

✅ Verifica existencia de Periodo, Programa y Asignatura.

✅ Solo permite oferta en periodos activos.

✅ No permite duplicar grupo (misma combinación periodo + programa + asignatura + identificador).

✅ cupo debe ser > 0.


📍 Endpoints

POST /api/Academium/oferta
GET /api/Academium/oferta **(Consultar todos)**
GET /api/Academium/oferta/:idOferta **(Consultar por ID)**
PUT /api/Academium/oferta/:idOferta
DELETE /api/Academium/oferta/:idOferta


🔐 Validaciones adicionales

Unicidad de códigos en todas las entidades base.

❌ Errores posibles:

{ "mensaje": "Error al crear oferta", "error": "Periodo no activo" }


Validaciones transversales implementadas con Zod en cada esquema.