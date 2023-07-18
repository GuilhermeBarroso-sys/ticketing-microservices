import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/Ticket";
import { Order, OrderStatus } from "../../models/Order";


it("has a route handler listening to /api/orders/:orderId for DELETE requests", async () => {
	const response = await request(app)
		.delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.getMockedCookie())
		.send({});
	// const errors = JSON.stringify(response.error.text);
	if(response.error) {
		const errors = JSON.parse(response.error.text);
		expect(response.status).toEqual(404);
		expect(errors).toBeTruthy();
	}


});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.getMockedCookie())
		.send({});

	expect(response.status).not.toEqual(401);
});

it("Shouldn't return an order", async () => {
	const response = await request(app)
		.delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.getMockedCookie())
		.send({});
	expect(response.status).toEqual(404);

});
it("Should throw an NotAuthorizedError error", async () => {
	const ticket = Ticket.build({
		price: 50,
		title: "Event"
	});
	const cookie1 = global.getMockedCookie();
	const cookie2 = global.getMockedCookie();

	await ticket.save();
	const orderCreated = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie1)
		.send({
			ticketId: ticket.id
		})
		.expect(201);
	const response = await request(app)
		.delete(`/api/orders/${orderCreated.body.id}`)
		.set("Cookie", cookie2)
		.send({})
		.expect(401);
	expect(response.status).toEqual(401);
});
it("Should return an cancelled order", async () => {
	const ticket = Ticket.build({
		price: 50,
		title: "Event"
	});
	const cookie = global.getMockedCookie();

	await ticket.save();
	const orderCreated = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			ticketId: ticket.id
		})
		.expect(201);
	const response = await request(app)
		.delete(`/api/orders/${orderCreated.body.id}`)
		.set("Cookie", cookie)

		.send({});
	expect(response.status).toEqual(200);
	expect(response.body.status).toBe(OrderStatus.Cancelled);
});