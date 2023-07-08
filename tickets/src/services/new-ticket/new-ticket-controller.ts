import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { z } from "zod";
import { NewTicketService } from "./new-ticket-service";

class NewTicketController {
	async handle(request: Request, response: Response) {

		const schema = z.object({
			title: z.string().trim().nonempty(),
			price: z.number().positive("Price should to be positive")
		});
		Validator.verifyBody({bodyParams: request.body, schema});
		const {title,price} = request.body;
		const userId = request.currentUser!.id;
		const newTicketService = new NewTicketService();
		const ticket = await newTicketService.execute({title,price,userId});
		return response.status(201).json(ticket);
	}
}


export {NewTicketController};