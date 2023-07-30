import { natsWrapper } from "../../../nats-wrapper";
import {OrderCreatedEvent, OrderStatus, TicketCreatedEvent} from "@gbotickets/common";

import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";
interface ISetupParams {
  throwError: boolean
}
const setup = async ({throwError} : ISetupParams) => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const ticket = Ticket.build({price: 50, title: "test", userId: new mongoose.Types.ObjectId().toHexString()});
	ticket.set({
		orderId: new mongoose.Types.ObjectId().toHexString()
	});
	await ticket.save();
	const id = new mongoose.Types.ObjectId().toHexString();
	const data : OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: throwError ? 3 : 0,
		status: OrderStatus.Created,
		expiresAt: new Date().toISOString(),
		ticket: {
			id: throwError ? id : ticket.id,
			price: ticket.price
		},
		userId: new mongoose.Types.ObjectId().toHexString()
	};
	// @ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, data, message};
};

it("Shouldn't acks the message", async()=>{
	const {data,listener,message} = await setup({throwError : true});
	expect(async () => await listener.onMessage(data, message)).rejects.toThrow();
	expect(message.ack).not.toBeCalled();

});
it("sets the orderId to undefined on the ticket", async()=>{
	const {data,listener,message} = await setup({throwError : false});
	await listener.onMessage(data, message);
	const ticket = await Ticket.findById(data.ticket.id);
	expect(ticket!.orderId).toBeFalsy();

});
it("acks the messages", async()=>{
	const {data,listener,message} = await setup({throwError : false});
	await listener.onMessage(data, message);
	expect(message.ack).toBeCalled();

});


