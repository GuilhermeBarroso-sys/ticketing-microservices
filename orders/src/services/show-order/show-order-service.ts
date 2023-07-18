import { NotAuthorizedError, NotFoundError } from "@gbotickets/common";
import { Order } from "../../models/Order";

interface IOrderTicket {
  orderId: string;
  userId: string;
}

class ShowOrderService {
	async execute({orderId, userId} : IOrderTicket) {
		const order = await Order.findById(orderId).populate("ticket");
		if(!order) throw new NotFoundError();
		if(userId !== order.userId) throw new NotAuthorizedError();

		return order;
	}
}

export { ShowOrderService };