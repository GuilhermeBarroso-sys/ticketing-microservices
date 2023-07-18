import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { z } from "zod";
import { NewOrderService } from "./new-order-service";

class NewOrderController {
	async handle(request: Request, response: Response) {

		const schema = z.object({
			ticketId: z.string().trim().nonempty(),
		});
		Validator.verifyBody({bodyParams: request.body, schema});
		const { ticketId } = request.body;
		const userId = request.currentUser!.id;

		const newOrderService = new NewOrderService();
		const order = await newOrderService.execute({userId, ticketId});
		return response.status(201).json(order);
	}
}


export {NewOrderController};