import { IPrograma  } from "./IPrograma";

export class programa implements IPrograma {
    
    idPrograma?: number;
    nombrePrograma: string;
    idNivel: number;
    idModalidad: number;
    duracionMeses: number;

    constructor(datosPrograma: IPrograma) {
        this.nombrePrograma = datosPrograma.nombrePrograma;
        this.idNivel = datosPrograma.idNivel;
        this.idModalidad = datosPrograma.idModalidad;
        this.duracionMeses = datosPrograma.duracionMeses;
    }
}
