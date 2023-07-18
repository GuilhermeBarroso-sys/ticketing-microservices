import { Request, Response } from "express";
import { AllOrderService } from "./all-order-service";

class AllOrderController {
	async handle(request: Request, response: Response) {
		const allOrderService = new AllOrderService();
		const orders = await allOrderService.execute({userId: request.currentUser!.id});
		return response.status(200).json(orders);
	}
}


export {AllOrderController};