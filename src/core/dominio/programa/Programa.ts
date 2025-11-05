import { IPrograma  } from "./IPrograma";

export class programa implements IPrograma {
    
    idPrograma?: string;
    nombrePrograma: string;
    nivelEducativo: string;
    modalidad: string;
    duracionMeses: string;

    constructor(datosPrograma: IPrograma) {
        this.nombrePrograma = datosPrograma.nombrePrograma;
        this.nivelEducativo = datosPrograma.nivelEducativo;
        this.modalidad = datosPrograma.modalidad;
        this.duracionMeses = datosPrograma.duracionMeses;
    }
}
