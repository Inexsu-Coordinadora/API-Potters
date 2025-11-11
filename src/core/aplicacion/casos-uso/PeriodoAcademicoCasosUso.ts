import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademicoCasosUso } from "./IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";

export class PeriodoAcademicoCasosUso implements IPeriodoAcademicoCasosUso {
  constructor(private periodoRepositorio: IPeriodoAcademicoRepositorio) { }

  async obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    return await this.periodoRepositorio.listarPeriodos(limite);
  }

  async obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    return await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
  }

  async crearPeriodo(datosPeriodo: PeriodoAcademicoDTO): Promise<number> {
    const fechaInicio = new Date(datosPeriodo.fechaInicio);
    const fechaFin = new Date(datosPeriodo.fechaFin);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error("Fecha invalida: formato incorrecto.");
    }

    if (fechaFin < fechaInicio) {
      throw new Error("Fecha invalida: la fecha de fin no puede ser menor que la de inicio.");
    }

    const estadoFinal = Number(datosPeriodo.idEstado);

    if (estadoFinal === 2) {
      const todosLosPeriodos = await this.periodoRepositorio.listarPeriodos();
      const periodosActivos = todosLosPeriodos.filter(p => Number(p.idEstado) === 2);

      const haySolapamiento = periodosActivos.some(periodoActivo => {
        const inicioExistente = new Date(periodoActivo.fechaInicio as string);
        const finExistente = new Date(periodoActivo.fechaFin as string);

        return (
          fechaInicio.getTime() <= finExistente.getTime() &&
          fechaFin.getTime() >= inicioExistente.getTime()
        );
      });

      if (haySolapamiento) {
        throw new Error("Solapamiento de fechas.");
      }
    }

    if (![1, 2].includes(estadoFinal)) {
      throw new Error("Transición invalida: no se puede crear un periodo en estado cerrado.");
    }
    const idNuevoPeriodo = await this.periodoRepositorio.crearPeriodo(datosPeriodo as IPeriodoAcademico);
    return idNuevoPeriodo;
  }

async actualizarPeriodo(
  idPeriodo: number,
  periodo: Partial<IPeriodoAcademico>
): Promise<IPeriodoAcademico | null> {
  const periodoActual = await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
  if (!periodoActual) {
    throw new Error("El periodo académico no existe.");
  }

  const inicioFinal = new Date(periodo.fechaInicio ?? periodoActual.fechaInicio);
  const finFinal = new Date(periodo.fechaFin ?? periodoActual.fechaFin);

  if (isNaN(inicioFinal.getTime()) || isNaN(finFinal.getTime())) {
    throw new Error("Fecha invalida: formato incorrecto.");
  }

  if (finFinal < inicioFinal) {
    throw new Error("Fecha invalida: la fecha de fin no puede ser menor que la de inicio.");
  }

  const estadoActualNum = Number(periodoActual.idEstado);
  const nuevoEstadoNum = Number(periodo.idEstado ?? periodoActual.idEstado);

  if (periodo.idEstado !== undefined) {
    const transicionesValidas: Record<number, number[]> = {
      1: [1, 2], // preparación → preparación o activo
      2: [2, 3], // activo → activo o cerrado
      3: [3],    // cerrado → cerrado
    };

    const estadosPermitidos = transicionesValidas[estadoActualNum] || [];

    if (!estadosPermitidos.includes(nuevoEstadoNum)) {
      throw new Error(`Transición invalida`);
    }
  }

  if (nuevoEstadoNum === 2) {
    const todosLosPeriodos = await this.periodoRepositorio.listarPeriodos();
    const otrosActivos = todosLosPeriodos.filter(
      (p) => Number(p.idEstado) === 2 && Number(p.idPeriodo) !== Number(idPeriodo)
    );

    const haySolapamiento = otrosActivos.some((p) => {
      const inicioExistente = new Date(p.fechaInicio as string);
      const finExistente = new Date(p.fechaFin as string);

      return (
        inicioFinal.getTime() <= finExistente.getTime() &&
        finFinal.getTime() >= inicioExistente.getTime()
      );
    });

    if (haySolapamiento) {
      throw new Error("Solapamiento de fechas.");
    }
  }

  const periodoActualizado = await this.periodoRepositorio.actualizarPeriodo(idPeriodo, {
    ...periodoActual,
    ...periodo,
  });

  return periodoActualizado || null;
}

  async eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    const periodoObtenido = await this.periodoRepositorio.eliminarPeriodo(idPeriodo);
    return periodoObtenido;
  }
}