import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";

it("has a route handler listening to /api/orders/ for GET requests", async () => {
	const response = await request(app)
		.get("/api/orders")
		.send({});
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.get("/api/orders")
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.send({});

	expect(response.status).not.toEqual(401);
});
it("Shouldn't return orders", async () => {
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", global.getMockedCookie())
		.expect(200);

	expect(response.body.length).toEqual(0);
});
it("Should return orders", async () => {
  
	// first user
	const firstUserTicketsId = [];
	const firstCookie = global.getMockedCookie();
	for(let i = 0; i < 3; i++) {
		const newTicket = Ticket.build({
			price: i+1,
			title: "test"+i,
			id: new mongoose.Types.ObjectId().toHexString()
		});
		await newTicket.save();
		await request(app)
			.post("/api/orders")
			.set("Cookie", firstCookie)
			.send({
				ticketId: newTicket.id
			})
			.expect(201);
		firstUserTicketsId.push(newTicket.id);
	}
	const firstResponse = await request(app)
		.get("/api/orders")
		.set("Cookie", firstCookie)
		.expect(200);
	expect(firstResponse.body.length).toBeGreaterThan(1);
	expect(firstResponse.body.length).toBe(3);
	for(const userOrder of firstResponse.body ) {
		const isThisTicketBelongsTheUser = firstUserTicketsId.includes(userOrder.ticket.id);
		expect(isThisTicketBelongsTheUser).toBe(true);
	}

	// second User
	const secondUserTicketsId = [];
	const secondCookie = global.getMockedCookie();
	for(let i = 0; i < 3; i++) {
		const newTicket = Ticket.build({
			price: i+1,
			title: "test"+i,
			id: new mongoose.Types.ObjectId().toHexString()
		});
		await newTicket.save();
		await request(app)
			.post("/api/orders")
			.set("Cookie", secondCookie)
			.send({
				ticketId: newTicket.id
			})
			.expect(201);
		secondUserTicketsId.push(newTicket.id);
	}
	const secondResponse = await request(app)
		.get("/api/orders")
		.set("Cookie", secondCookie)
		.expect(200);
	expect(secondResponse.body.length).toBeGreaterThan(1);
	expect(secondResponse.body.length).toBe(3);
	for(const userOrder of secondResponse.body ) {
		const isThisTicketBelongsTheUser = secondUserTicketsId.includes(userOrder.ticket.id);
		expect(isThisTicketBelongsTheUser).toBe(true);
	}
	
});