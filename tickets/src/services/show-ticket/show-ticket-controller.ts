import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { ShowTicketService } from "./show-ticket-service";
// import { z } from "zod";

class ShowTicketController {
	async handle(request: Request, response: Response) {
		// const schema = z.object({
		// 	title: z.string().trim().nonempty(),
		// 	price: z.number().positive("Price should to be positive")
		// });
		// Validator.verifyBody({bodyParams: request.body, schema});
		const {ticketId} = request.params;
		const showTicketService = new ShowTicketService();
		const ticket = await showTicketService.execute({ticketId});
		return response.status(200).json(ticket);
	}
}


export {ShowTicketController};