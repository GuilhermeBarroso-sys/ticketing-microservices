import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";





it("has a route handler listening to /api/orders for post requests", async () => {
	const response = await request(app)
		.post("/api/orders")
		.send({});
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.post("/api/orders")
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({});

	expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "",
			price: 10,
		})
		.expect(400);
});
it("return an error if an invalid ticketId is provided", async () => {
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			ticketId: null
		})
		.expect(400);
});
it("Shouldn't create a order because ticket doesn't exist", async () => {
	// const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			ticketId: new mongoose.Types.ObjectId().toHexString()
		})
		.expect(404);
});
it("create a order with valid inputs", async () => {
	const newTicket = Ticket.build({
		price: 10,
		title: "test",
		id: new mongoose.Types.ObjectId().toHexString()
	});
	await newTicket.save();
	let verifyorders = await Order.find({});
	expect(verifyorders.length).toEqual(0);
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			ticketId: newTicket.id
		})
		.expect(201);
	verifyorders = await Order.find({}); 
	expect(verifyorders.length).toEqual(1);
});

it("Shouldn't create order because ticket is reserved", async () => {
	const newTicket = Ticket.build({
		price: 10,
		title: "test",
		id: new mongoose.Types.ObjectId().toHexString()
	});
	await newTicket.save();
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			ticketId: newTicket.id
		})
		.expect(201);

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({
			ticketId: newTicket.id
		})
		.expect(400);

});
