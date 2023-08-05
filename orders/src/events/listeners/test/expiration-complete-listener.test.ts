import { natsWrapper } from "../../../nats-wrapper";

import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { ExpirationCompleteEvent, OrderStatus, TicketUpdatedEvent } from "@gbotickets/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/Order";

const setup = async () => {

	const ticketCreated = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 55,
	});
	await ticketCreated.save();
	const orderCreated = Order.build({
		expiresAt: new Date(),
		ticket: ticketCreated,
		userId: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created
	});
	await orderCreated.save();
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	// @ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, message, orderCreatedData : orderCreated,  ticketCreatedData: ticketCreated};
};

it("Shouldn't ack the message", async()=>{
	const {listener,message, ticketCreatedData} = await setup();
	const data : ExpirationCompleteEvent["data"] = {
		orderId: new mongoose.Types.ObjectId().toHexString()
	};
	expect(async () => await listener.onMessage(data, message)).rejects.toThrow();
	const order = await Order.findById(data.orderId);
	expect(order).toBeFalsy();
	expect(message.ack).not.toBeCalled();



});
it("ack the message if the order already been completed", async()=>{
	const {listener,message, orderCreatedData} = await setup();
	const data : ExpirationCompleteEvent["data"] = {
		orderId: orderCreatedData.id
	};
	await listener.onMessage(data, message);
	const order = await Order.findById(data.orderId);
	expect(order).toBeDefined();
	expect(order?.status).toBe(OrderStatus.Cancelled);
	expect(message.ack).toBeCalled();

});
it("acks the messages", async()=>{
	const {listener,message, orderCreatedData} = await setup();
	orderCreatedData.set({
		status: OrderStatus.Complete
	});
	await orderCreatedData.save();
	const data : ExpirationCompleteEvent["data"] = {
		orderId: orderCreatedData.id
	};
	await listener.onMessage(data, message);
	const order = await Order.findById(data.orderId);
	expect(order).toBeDefined();
	expect(order?.status).toBe(OrderStatus.Complete);
	expect(message.ack).toBeCalled();

});