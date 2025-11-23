export class ReglaNegocioError extends Error {
  public readonly statusCode = 422;
  constructor(message: string) {
    super(message);
    this.name = "ReglaNegocioError";
    Object.setPrototypeOf(this, ReglaNegocioError.prototype);
  }
}
