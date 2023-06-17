import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../src/errors/not-authorized-error";

export function requireAuth(request: Request, response: Response, next : NextFunction) {
	if(!request.currentUser) {
		throw new NotAuthorizedError();
	}
	next();
}