import { natsWrapper } from "../../../nats-wrapper";

import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { PaymentCreatedListener } from "../payment-created-listener";
import { Order, OrderStatus } from "../../../models/Order";

const setup = async () => {
	const listener = new PaymentCreatedListener(natsWrapper.client);
	//@ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, message};
};

it("Should throw an error because the order doesn't exist", async()=>{
	const {listener,message} = await setup();
	const orderId = new mongoose.Types.ObjectId().toHexString();
	expect(async() => await listener.onMessage({
		id: new mongoose.Types.ObjectId().toHexString(),
		orderId,
		stripeId: "test"
	}, message)).rejects.toThrow();




});

it("should ack the message", async()=>{
	const ticket =  Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 50,
		title: "test"
	}); 
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.AwaitingPayment,
		expiresAt: new Date(),
		ticket,
		userId: new mongoose.Types.ObjectId().toHexString()
	});
	await order.save();
	const {listener,message} = await setup();
	await listener.onMessage({
		id: new mongoose.Types.ObjectId().toHexString(),
		orderId: order.id,
		stripeId: "test"
	}, message);
	expect(message.ack).toBeCalled();

});