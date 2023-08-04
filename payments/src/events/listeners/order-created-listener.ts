import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@gbotickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/Order";
class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;
	async onMessage(data : OrderCreatedEvent["data"], msg: Message) {
		const order = Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version
		});
		// const order = await Order.findById(data.id);
		await order.save();
		msg.ack();
	}

}

export { OrderCreatedListener };