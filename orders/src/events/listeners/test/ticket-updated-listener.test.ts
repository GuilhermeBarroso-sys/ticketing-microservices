import { natsWrapper } from "../../../nats-wrapper";

import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@gbotickets/common";

const setup = async () => {

	const ticketCreated = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 55,
	});
	await ticketCreated.save();
	const listener = new TicketUpdatedListener(natsWrapper.client);
	const data : TicketUpdatedEvent["data"] = {
		id: ticketCreated.id,
		title: "testttt",
		version: ticketCreated.version + 1,
		price: 555,
		userId: new mongoose.Types.ObjectId().toHexString()

	};
	// @ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, data, message, ticketCreatedData: ticketCreated};
};

it("creates and saves a ticket", async()=>{
	const {data,listener,message, ticketCreatedData} = await setup();
	await listener.onMessage(data, message);
	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket!.title).not.toEqual(ticketCreatedData.title);
	expect(ticket!.price).not.toEqual(ticketCreatedData.price);
	expect(ticket!.version).not.toEqual(ticketCreatedData.version);



});

it("acks the messages", async()=>{
	const {data,listener,message} = await setup();
	await listener.onMessage(data, message);
	expect(message.ack).toBeCalled();

});

it("does not call ack if the event has a skipped version", async()=>{
	const {data,listener,message, ticketCreatedData} = await setup();
	data.version = 3;
	expect(async () => await listener.onMessage(data, message)).rejects.toThrow();
	expect(message.ack).not.toBeCalled();

});