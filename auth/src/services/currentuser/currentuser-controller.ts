import { Request, Response } from "express";

class CurrentUserController {
	async handle(request: Request, response: Response) {
		return response.json({currentUser: request.currentUser || null});
	}
}


export { CurrentUserController };