import { NextFunction, Request, Response } from "express";
import { CustomError } from "../src/errors/custom-error";

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
	return error instanceof CustomError 
		? response.status(error.statusCode).json({ errors: error.serializeErrors() })
		: response.status(500).json({ errors: [ { message: error.message } ] });
}