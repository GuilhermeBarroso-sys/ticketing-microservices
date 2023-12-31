import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@gbotickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { queueGroupName } from "./queue-group-name";

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;
	async onMessage(data : PaymentCreatedEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId);
		if(!order) {
			throw new NotFoundError();
		}
		order.set({
			status: OrderStatus.Complete
		});
		await order.save();
		msg.ack();
	}
}

export { PaymentCreatedListener };
