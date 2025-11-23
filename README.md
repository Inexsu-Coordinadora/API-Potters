📘 Entrega 3 — Gestión Académica Administrativa

Autores: Santiago Barrera, Jefferson Perdomo Patiño, Juliana Perez Muñoz
Versión: 3.0
Grupo: API Potters
Proyecto: Academium
Base de datos: PostgreSQL
Framework: Fastify + Node.js
Video del funcionamiento: https://youtu.be/ctU2fGIkPBw

🧱 Descripción general

En esta tercera entrega del proyecto Academium se consolidan y amplían las funcionalidades desarrolladas anteriormente, incorporando capacidades que permiten llevar a cabo la ejecución real del proceso académico dentro de la institución. A partir de las tablas y servicios creados en las entregas previas, como Programa, Asignatura, Periodo Académico, planes de estudio y ofertas académicas, esta fase integra nuevos mecanismos orientados a fortalecer la planificación, asegurar la consistencia del modelo académico y habilitar acciones operativas clave.

En esta etapa se añaden mejoras significativas en la gestión académica, reforzando validaciones, automatizando transiciones entre estados y habilitando operaciones relacionadas con inscripción, control de carga académica y verificación de coherencia entre programas, asignaturas y períodos. Asimismo, se consolidan las relaciones entre las entidades existentes para garantizar integridad, trazabilidad y continuidad en el proceso académico institucional.

🧱 Objetivo general

Desarrollar y consolidar una API académica que permita gestionar de forma eficiente los procesos administrativos y académicos de la institución educativa, abarcando la creación, consulta, actualización y eliminación de entidades clave como programas académicos, asignaturas, planes de estudio, períodos académicos y ofertas académicas. Esta entrega se orienta a garantizar la integridad de los datos, la trazabilidad de la información y la correcta ejecución de los flujos de estado asociados al proceso académico.


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
GET /api/Academium/planestudio *(Consultar todos)*
GET /api/Academium/planestudio/:idPlanestudio *(Consultar por ID)*
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
GET /api/Academium/periodoacademico *(Consultar todos)*
GET /api/Academium/periodoacademico/:idPeriodoacademico *(Consultar por ID)*
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
GET /api/Academium/oferta *(Consultar todos)*
GET /api/Academium/oferta/:idOferta *(Consultar por ID)*
PUT /api/Academium/oferta/:idOferta
DELETE /api/Academium/oferta/:idOferta


🔐 Validaciones adicionales

Unicidad de códigos en todas las entidades base.

❌ Errores posibles:

{ "mensaje": "Error al crear oferta", "error": "Periodo no activo" }


Validaciones transversales implementadas con Zod en cada esquema.


🧱 Estrategia de pruebas

Luego de aplicar los ajustes funcionales y estructurales de esta tercera entrega, se desarrolló una estrategia completa de pruebas automatizadas con el objetivo de garantizar la estabilidad, calidad y coherencia del sistema.

Se implementaron dos tipos principales de pruebas:

Pruebas unitarias

Enfocadas en validar la lógica interna de cada módulo, caso de uso y capa de aplicación.
Permiten comprobar que cada componente funciona de forma aislada y cumple sus reglas de negocio.

Pruebas de integración

Validan el flujo completo de extremo a extremo, desde la recepción de una petición en el controlador, pasando por la capa de aplicación, hasta llegar al repositorio y devolver una respuesta al cliente.
Estas pruebas aseguran que los distintos módulos del sistema trabajen de manera coordinada.

Las pruebas abarcan las entidades fundamentales del sistema:

Asignatura

Oferta Académica

Período Académico

Programa Académico

Cada caso de prueba verifica aspectos específicos como:
reglas de negocio, manejo de peticiones HTTP, validación de datos y persistencia en la base de datos.

✔ Scripts de ejecución

Para facilitar la ejecución de las pruebas, se incluyeron dos scripts dentro del archivo package.json:

## npm run unit-test

Este comando ejecuta únicamente las pruebas unitarias, arrojando este resultado:


Test Suites: 15 passed, 15 total
Tests:       184 passed, 184 total
Snapshots:   0 total
Time:        3.947 s

## npm run integration-test

Este comando ejecuta únicamente las pruebas de integración, arrojando este resultado:

Test Suites: 4 passed, 4 total                                                                       
Tests:       32 passed, 32 total                                                                     
Snapshots:   0 total
Time:        3.104 s

## npm run test

Este comando ejecuta todas las pruebas de integración y unitarias, arrojando este resultado:

Test Suites: 19 passed, 19 total
Tests:       216 passed, 216 total
Snapshots:   0 total
Time:        3.926 s, estimated 5 s

## npm test -- --coverage

Este comando genera una métrica que muestra qué porcentaje de código está siendo ejecutado por las pruebas, arrojando este resultado:

--------------------------------------|---------|----------|---------|---------|-------------------
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------------------|---------|----------|---------|---------|-------------------
All files                             |   74.55 |    58.88 |   70.96 |   74.48 | 
 config                               |     100 |      100 |     100 |     100 | 
  database.ts                         |     100 |      100 |     100 |     100 | 
  http.ts                             |     100 |      100 |     100 |     100 | 
 core/aplicacion/casos-uso            |    95.5 |    90.47 |     100 |     100 | 
  AsignaturaCasosUso.ts               |     100 |      100 |     100 |     100 | 
  OfertaCasosUso.ts                   |   87.87 |    77.77 |     100 |     100 | 41-42,62-69,75   
  PeriodoAcademicoCasosUso.ts         |   97.72 |    92.59 |     100 |     100 | 52,64
  PlanEstudioCasosUso.ts              |     100 |      100 |     100 |     100 | 
  ProgramaCasosUso.ts                 |     100 |      100 |     100 |     100 | 
 core/dominio/enum                    |     100 |      100 |     100 |     100 | 
  estadoPeriodoAcademico.ts           |     100 |      100 |     100 |     100 | 
 core/dominio/errores                 |     100 |      100 |     100 |     100 | 
  encontrarError.ts                   |     100 |      100 |     100 |     100 | 
  reglaNegocioError.ts                |     100 |      100 |     100 |     100 | 
 core/dominio/periodoAcademico        |   85.71 |       50 |     100 |   85.71 | 
  PeriodoAcademico.ts                 |   85.71 |       50 |     100 |   85.71 | 24,28
 core/infraestructura/postgres        |    9.35 |        0 |       0 |    9.41 | 
  asignaturaRepository.ts             |    8.33 |        0 |       0 |    8.33 | 8-56
  clientePostgres.ts                  |   71.42 |      100 |       0 |   83.33 | 17
  ofertaRepository.ts                 |    6.06 |        0 |       0 |    6.06 | 10-85
  periodoAcademicoRepository.ts       |    7.14 |        0 |       0 |    7.14 | 11-138
  planEstudioRepository.ts            |    4.87 |        0 |       0 |    4.87 | 10-97
  programaRepository.ts               |    8.33 |        0 |       0 |    8.33 | 8-56
 presentacion                         |   77.41 |       50 |   66.66 |   76.66 | 
  app.ts                              |   77.41 |       50 |   66.66 |   76.66 | 31-33,51-61      
 presentacion/controladores           |   98.29 |       50 |     100 |   98.29 | 
  asignaturaControlador.ts            |     100 |      100 |     100 |     100 | 
  ofertaControlador.ts                |    92.5 |       50 |     100 |    92.5 | 34,79,101        
  periodoAcademicoControlador.ts      |     100 |      100 |     100 |     100 | 
  planEstudioControlador.ts           |     100 |      100 |     100 |     100 | 
  programaControlador.ts              |     100 |      100 |     100 |     100 | 
 presentacion/esquemas                |   87.87 |       60 |     100 |   87.87 | 
  asignaturaEsquema.ts                |     100 |      100 |     100 |     100 | 
  envEsquema.ts                       |   69.23 |    33.33 |     100 |   69.23 | 39-42
  ofertaEsquema.ts                    |     100 |      100 |     100 |     100 | 
  periodoAcademicoEsquema.ts          |     100 |      100 |     100 |     100 | 
  planEstudioEsquema.ts               |     100 |      100 |     100 |     100 | 
  programaAcademicoEsquema.ts         |     100 |      100 |     100 |     100 | 
 presentacion/rutas                   |     100 |      100 |     100 |     100 | 
  gestionAsignaturaEnrutador.ts       |     100 |      100 |     100 |     100 | 
  gestionOfertaEnrutador.ts           |     100 |      100 |     100 |     100 | 
  gestionPeriodoAcademicoEnrutador.ts |     100 |      100 |     100 |     100 |                   
  gestionPlanEstudioEnrutador.ts      |     100 |      100 |     100 |     100 | 
  gestionProgramaEnRutador.ts         |     100 |      100 |     100 |     100 | 
 utils                                |      20 |        0 |       0 |      25 | 
  fecha.util.ts                       |      20 |        0 |       0 |      25 | 2-5
--------------------------------------|---------|----------|---------|---------|-------------------
Test Suites: 19 passed, 19 total
Tests:       216 passed, 216 total
Snapshots:   0 total
Time:        4.319 s

✔ Beneficio general

Gracias a estos comandos, es posible verificar rápidamente que el sistema se mantiene estable después de cada cambio, garantizando que la API cumple con los criterios de calidad establecidos durante la planificación del proyecto.