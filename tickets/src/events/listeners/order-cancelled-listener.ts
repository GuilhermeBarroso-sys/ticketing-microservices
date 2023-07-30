import { Listener, NotFoundError, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@gbotickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { ticketRoutes } from "../../routes/ticket";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;
	async onMessage(data : OrderCreatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);
		if(!ticket) {
			throw new NotFoundError();
		} 
		ticket.set({
			orderId: undefined
		});
		await ticket.save();
		new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId
		});
		msg.ack();
	}
  
}