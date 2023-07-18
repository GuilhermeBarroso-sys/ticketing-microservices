import { Validator } from "@gbotickets/common";
import { Request, Response } from "express";
import {  ShowOrderService } from "./show-order-service";
// import { z } from "zod";

class ShowOrderController {
	async handle(request: Request, response: Response) {
		const {orderId} = request.params;
		const { currentUser } = request;
    
		const showOrderService = new ShowOrderService();
		const order = await showOrderService.execute({orderId, userId: currentUser!.id });
		return response.status(200).json(order);
	}
}


export {ShowOrderController};