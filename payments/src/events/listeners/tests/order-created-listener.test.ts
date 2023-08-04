import { natsWrapper } from "../../../nats-wrapper";

import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus} from "@gbotickets/common";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);
	const data : OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
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

it("Should save the order", async()=> {
	const {listener,message, data} = await setup();
	
	await listener.onMessage(data, message);
	expect(message.ack).toHaveBeenCalled();



});