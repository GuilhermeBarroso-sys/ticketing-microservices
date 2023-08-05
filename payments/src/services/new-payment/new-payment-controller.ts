import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { z } from "zod";
import { NewPaymentService } from "./new-payment-service";

class NewPaymentController {
	async handle(request: Request, response: Response) {

		const schema = z.object({
			token: z.string().trim().nonempty(),
			orderId: z.string().trim().nonempty()
		});
		Validator.verifyBody({bodyParams: request.body, schema});
		const {token, orderId} = request.body;
		const userId = request.currentUser!.id;
		const newPaymentService = new NewPaymentService();
		const payment = await newPaymentService.execute({orderId,token,userId});
		return response.status(201).json(payment);
	}
}


export {NewPaymentController};