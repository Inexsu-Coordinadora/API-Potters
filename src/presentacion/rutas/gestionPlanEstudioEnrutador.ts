import { FastifyInstance } from "fastify";
import { PlanEstudioControlador } from "../controladores/planEstudioControlador";
import { IPlanEstudioRepositorio } from "../../core/dominio/repositorio/IPlanEstudioRepositorio";
import { PlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/PlanEstudioCasosUso";
import { PlanEstudioRepositorio } from "../../core/infraestructura/postgres/planEstudioRepository";
import { IPlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/IPlanEstudioCasosUso";

function gestionPlanEstudioEnrutador(
    app: FastifyInstance,
    planEstudioControlador: PlanEstudioControlador,
) {

    app.get("/planestudio", planEstudioControlador.obtenerPlanEstudio);
    app.get("/planestudio/:idPlanEstudio", planEstudioControlador.obtenerPlanEstudioPorId);
    app.post("/planestudio", planEstudioControlador.crearPlanEstudio);
    app.put("/planestudio/:idPlanEstudio", planEstudioControlador.actualizarPlanEstudio);
    app.delete("/planestudio/:idPlanEstudio", planEstudioControlador.eliminarPlanEstudio);
}

export async function construirPlanEstudioControlador(app: FastifyInstance) {
    const planEstudioRepositorio: IPlanEstudioRepositorio = new PlanEstudioRepositorio();
    const planEstudioCasosUso: IPlanEstudioCasosUso = new PlanEstudioCasosUso(planEstudioRepositorio);
    const planEstudioControlador = new PlanEstudioControlador(planEstudioCasosUso);

    gestionPlanEstudioEnrutador(app, planEstudioControlador);
}