import { CustomError, TError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
	public statusCode = 500;
	public reason = "Error connecting to database";
	constructor() {
		super("Error connecting to database");
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}


	serializeErrors() : Array<TError> {
		return [
			{
				message: this.reason, 
			}
		];
	}
}