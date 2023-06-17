import { CustomError, TError } from "./custom-error";



export class BadRequestError extends CustomError {
	public statusCode = 400;

	constructor(public error : string) {
		super("Bad Request Error: " + error);
		this.error = error;
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
	serializeErrors(): TError[] {
		return [
			{
				message: this.error
			}
		];
	}

}