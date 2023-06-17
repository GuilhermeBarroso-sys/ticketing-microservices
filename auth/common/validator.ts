import { ZodObject, ZodObjectDef } from "zod";
import { RequestValidationError } from "../src/errors/request-validation-error";

interface IVerifyBodyParams {
  bodyParams : Record<string, any>,
  schema: ZodObject<any>
}

export class Validator {
	static verifyBody({bodyParams, schema} : IVerifyBodyParams) : void {
		const validation = schema.safeParse(bodyParams);
		if(!validation.success) throw new RequestValidationError(validation.error.errors);
	}
}
