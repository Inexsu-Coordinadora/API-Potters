export class ValidacionError extends Error {
    public readonly statusCode: number = 400;
    
    constructor(message: string, public readonly campo?: string) {
        super(message);
        this.name = 'ValidacionError';
        Object.setPrototypeOf(this, ValidacionError.prototype); 
    }
}
