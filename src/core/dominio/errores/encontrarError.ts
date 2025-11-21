export class EntidadNoEncontradaError extends Error {
  public readonly statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = "EntidadNoEncontradaError";
    Object.setPrototypeOf(this, EntidadNoEncontradaError.prototype);
  }
}
