import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { z } from "zod";
import { UpdateTicketService } from "./update-ticket-service";

class UpdateTicketController {
	async handle(request: Request, response: Response) {

		const schema = z.object({
			title: z.string().trim().nonempty(),
			price: z.number().positive("Price should to be positive")
		});
		Validator.verifyBody({bodyParams: request.body, schema});
		const {title,price} = request.body;
		const userId = request.currentUser!.id;
		const {ticketId} = request.params;
		const updateTicketService = new UpdateTicketService();
		const ticket = await updateTicketService.execute({title,price,userId, ticketId});
		return response.status(200).json(ticket);
	}
}


export {UpdateTicketController};