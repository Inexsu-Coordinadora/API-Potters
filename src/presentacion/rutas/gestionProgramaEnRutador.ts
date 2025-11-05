import { FastifyInstance } from "fastify";
import { ProgramasControlador } from "../controladores/programaControlador";
import { IProgramaRepositorio } from "../../core/dominio/repositorio/IProgramaRepositorio";
import { ProgramaCasosUso } from "../../core/aplicacion/casos-uso/ProgramaCasosUso";
import { ProgramaRepositorio } from "../../core/infraestructura/postgres/programaRepository";
import { IProgramaCasosUso } from "../../core/aplicacion/casos-uso/IProgramaCasosUso";

function gestionAcademicaEnrutador(
    app: FastifyInstance,
    programaController: ProgramasControlador,
) {
    app.get("/programas", programaController.obtenerPrograma);
    app.get("/programas/:idPrograma", programaController.obtenerProgramaPorId);
    app.post("/programas", programaController.crearPrograma);
    app.put("/programas/:idPrograma", programaController.actualizarPrograma);
    app.delete("/programas/:idPrograma", programaController.eliminarPrograma);
}

export async function construirProgramasEnrutador(app: FastifyInstance){
    const programaRepositorio: IProgramaRepositorio = new ProgramaRepositorio();
    const programaCasosUso: IProgramaCasosUso = new ProgramaCasosUso(programaRepositorio);
    const programaController = new ProgramasControlador(programaCasosUso);

    gestionAcademicaEnrutador(app, programaController);
}