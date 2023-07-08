import { Request, Response } from "express";
import { AllTicketService } from "./all-ticket-service";

class AllTicketController {
	async handle(request: Request, response: Response) {
		const allTicketService = new AllTicketService();
		const tickets = await allTicketService.execute();
		return response.status(200).json(tickets);
	}
}


export {AllTicketController};