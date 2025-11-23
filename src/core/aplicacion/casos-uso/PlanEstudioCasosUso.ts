import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { IPlanEstudioCasosUso } from "./IPlanEstudioCasosUso";
import { PlanEstudioDTO } from "../../../presentacion/esquemas/planEstudioEsquema";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { ValidacionError } from "../../dominio/errores/validacionError";
import { IPlanEstudioRelacionado } from "../../dominio/planEstudio/IPlanEstudioRelacionado";
import { EntidadNoEncontradaError } from "../../dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../dominio/errores/reglaNegocioError";

export class PlanEstudioCasosUso implements IPlanEstudioCasosUso {
    constructor(
        private planEstudioRepositorio: IPlanEstudioRepositorio,
        private programaRepositorio: IProgramaRepositorio,
        private asignaturaRepositorio: IAsignaturaRepositorio
    ) { }

    async obtenerPlanEstudio(limite?: number): Promise<IPlanEstudio[]> {
        const lista = await this.planEstudioRepositorio.listarPlanEstudio(limite);
        if (!lista || lista.length == 0) throw new EntidadNoEncontradaError("No se encontró ningún plan de estudio");
        return lista;
    }

    async obtenerPlanEstudioPorId(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const planEstudioObtenido = await this.planEstudioRepositorio.obtenerPlanEstudioPorId(idPlanEstudio);
        if (!planEstudioObtenido) throw new EntidadNoEncontradaError("No se encontró ningún plan de estudio");
        return planEstudioObtenido;
    }

    async crearPlanEstudio(datosPlanEstudio: PlanEstudioDTO): Promise<IPlanEstudioRelacionado> {
        const { idPrograma, idAsignatura, semestre, creditos } = datosPlanEstudio;

        const programaExiste = await this.programaRepositorio.obtenerProgramaPorId(idPrograma);
        if (!programaExiste) throw new EntidadNoEncontradaError(`El programa académico con ID ${idPrograma} no existe`);

        const asignaturaExiste = await this.asignaturaRepositorio.obtenerAsignaturaPorId(idAsignatura);
        if (!asignaturaExiste) throw new EntidadNoEncontradaError(`La asignatura con ID ${idAsignatura} no existe`);

        const isDuplicado = await this.planEstudioRepositorio.existeDuplicidad(
            idPrograma,
            idAsignatura,
            semestre
        );

        if (isDuplicado) throw new ReglaNegocioError('El plan de estudio ya existe para este programa, asignatura y semestre');

        const datosParaRegistro: IPlanEstudio = {
            idPrograma,
            idAsignatura,
            semestre,
            creditos
        };

        const idNuevoPlanEstudio = await this.planEstudioRepositorio.crearPlanEstudio(datosParaRegistro);
        const PlanEstudioRelacionado = await this.planEstudioRepositorio.obtenerPlanEstudioRelacionado(idNuevoPlanEstudio);

        return PlanEstudioRelacionado;
    }

    async actualizarPlanEstudio(idPlanEstudio: number, planEstudio: IPlanEstudio): Promise<IPlanEstudioRelacionado | null> {
        const { idPrograma, idAsignatura, semestre } = planEstudio;

        const planEstudioExistente = await this.planEstudioRepositorio.obtenerPlanEstudioPorId(idPlanEstudio);
        if (!planEstudioExistente) throw new EntidadNoEncontradaError("No se encontró el plan de estudio");

        const programaExiste = await this.programaRepositorio.obtenerProgramaPorId(idPrograma);
        if (!programaExiste) throw new EntidadNoEncontradaError(`El Programa con ID ${idPrograma} no existe.`);

        const asignaturaExiste = await this.asignaturaRepositorio.obtenerAsignaturaPorId(idAsignatura);
        if (!asignaturaExiste) throw new EntidadNoEncontradaError(`La Asignatura con ID ${idAsignatura} no existe.`);

        const isDuplicado = await this.planEstudioRepositorio.existeDuplicidad(
            idPrograma,
            idAsignatura,
            semestre,
            idPlanEstudio
        );

        if (isDuplicado) throw new ReglaNegocioError('El plan de estudio ya existe para este programa, asignatura y semestre');

        await this.planEstudioRepositorio.actualizarPlanEstudio(
            idPlanEstudio,
            planEstudio
        );

        const PlanEstudioRelacionado = await this.planEstudioRepositorio.obtenerPlanEstudioRelacionado(idPlanEstudio);
        return PlanEstudioRelacionado;
    }

    async eliminarPlanEstudio(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const planEstudioObtenido = await this.planEstudioRepositorio.eliminarPlanEstudio(idPlanEstudio);
        if (!planEstudioObtenido) throw new EntidadNoEncontradaError("No se encontró ningún plan de estudio");
        return planEstudioObtenido;
    }
}
