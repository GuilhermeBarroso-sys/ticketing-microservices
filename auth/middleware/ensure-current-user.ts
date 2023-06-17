import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ICurrentUser } from "../src/models/User";
declare global {
  namespace Express {
    export interface Request {
      currentUser: ICurrentUser | null;
    }
  }

}
export function ensureCurrentUser(request : Request, response: Response, next : NextFunction) {
	if(!request.session?.jwt) {
		return next();
	}
	try {
		const payload = jwt.verify(request.session.jwt, process.env.JWT_KEY as string) as ICurrentUser;
		request.currentUser = payload;
	} catch(err) {
	}
	return next();
} 