import { Request, Response } from "express";

class SignoutController {
	async handle(request : Request, response: Response) {
		request.session = null;
		response.status(204).send();
	}
}


export { SignoutController};