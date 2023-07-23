import { natsWrapper } from "../../../nats-wrapper";
import {TicketCreatedEvent} from "@gbotickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);
	const data : TicketCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		version: 0,
		price: 55,
		userId: new mongoose.Types.ObjectId().toHexString()
	};
	// @ts-ignore
	const message : Message =  {
		ack: jest.fn()
	};
	return {listener, data, message};
};

it("creates and saves a ticket", async()=>{
	const {data,listener,message} = await setup();
	await listener.onMessage(data, message);
	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);


});

it("acks the messages", async()=>{
	const {data,listener,message} = await setup();
	await listener.onMessage(data, message);
	expect(message.ack).toBeCalled();

});