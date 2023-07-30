import { NotAuthorizedError, NotFoundError, OrderStatus } from "@gbotickets/common";
import { Order } from "../../models/Order";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

interface IOrderTicket {
  orderId: string;
  userId: string;
}

class DeleteOrderService {
	async execute({orderId, userId} : IOrderTicket) {
		const order = await Order.findById(orderId).populate("ticket");
		if(!order) throw new NotFoundError();
		if(userId !== order.userId) throw new NotAuthorizedError();
		order.status = OrderStatus.Cancelled;
		await order.save();
		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id
			},
			version: order.version
		});
		return order;
	}
}

export { DeleteOrderService };