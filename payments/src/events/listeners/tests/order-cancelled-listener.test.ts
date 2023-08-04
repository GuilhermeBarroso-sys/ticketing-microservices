import { natsWrapper } from "../../../nats-wrapper";

import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus} from "@gbotickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/Order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const id = new mongoose.Types.ObjectId().toHexString();
	const order = Order.build({
		id ,
		price: 50,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 2
	});
	order.set({
		_id: id,
	});
	await order.save();
	const data : OrderCreatedEvent["data"] = {
		id,
		expiresAt: new Date().toString(),
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 1,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 50
		}
	};
	// @ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, message, data};
};

it("Should throw a not found error ", async()=> {
	const {listener,message, data} = await setup();
	expect(async () => await listener.onMessage(data, message)).rejects.toThrow();
	expect(message.ack).not.toHaveBeenCalled();
});

it("Should call ack function ", async()=> {
	const {listener,message, data} = await setup();
	await listener.onMessage(data, message);
	expect(message.ack).toHaveBeenCalled();
});