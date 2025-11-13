import { IEstadoperiodoacademico } from "./Iestadoperiodoacademico";

export class Estadoperiodoacademico implements IEstadoperiodoacademico {

    idEstado?: number;
    estadoPeriodo: string;

    constructor(datosEstado: IEstadoperiodoacademico) {
        this.estadoPeriodo = datosEstado.estadoPeriodo;
    }
}
