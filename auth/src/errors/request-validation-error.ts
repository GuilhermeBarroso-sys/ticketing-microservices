import { ZodError, z } from "zod";
import { CustomError, TError } from "./custom-error";

class RequestValidationError extends CustomError {
	public statusCode = 400;
	constructor(public errors : z.ZodIssue[]) {
		super("Invalid request parameters");
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors () : Array<TError> {
		return this.errors.map((error) => {
			return {
				message: error.message,
				field: error.path[0].toString()
			};
		});
	}
}
export {RequestValidationError};
