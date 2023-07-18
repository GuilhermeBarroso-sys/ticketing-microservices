import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import { DeleteOrderService } from "./delete-order-service";
// import { z } from "zod";

class DeleteOrderController {
	async handle(request: Request, response: Response) {
	
		const {orderId} = request.params;
		const {currentUser} = request;
		const deleteOrderService = new DeleteOrderService();
		const order = await deleteOrderService.execute({orderId, userId: currentUser!.id});
		return response.status(200).json(order);
	}
}


export {DeleteOrderController};