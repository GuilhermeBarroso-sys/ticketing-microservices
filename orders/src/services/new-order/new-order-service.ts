import { BadRequestError, NotFoundError, OrderStatus } from "@gbotickets/common";
import { Ticket } from "../../models/Ticket";
import { Order } from "../../models/Order";
import { OrderCreatedPublisher } from "../../events/publishers/order-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

interface INewOrder {
  ticketId: string
  userId: string
}

class NewOrderService {
	private EXPIRATION_WINDOW_SECONDS = 1 * 60;
	// private EXPIRATION_WINDOW_SECONDS = 2;
	async execute({ticketId, userId} : INewOrder) {
		const ticket = await Ticket.findById(ticketId);
		if(!ticket) {
			throw new NotFoundError();
		}


		const isReserved = await ticket.isReserved();
		if(isReserved) {
			throw new BadRequestError("Ticket is already reserved");
		}

		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + this.EXPIRATION_WINDOW_SECONDS);

		const order = Order.build({
			userId,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket
		});
		await order.save();
		const {id,status,expiresAt} = order;
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id,
			status,
			expiresAt: expiresAt.toISOString(),
			userId,
			ticket: {
				id: ticket.id,
				price: ticket.price
			},
			version: order.version

		});
		return order;
	}
}

export { NewOrderService };