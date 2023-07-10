import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";




it("has a route handler listening to /api/tickets for post requests", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.send({});
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.post("/api/tickets")
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({});

	expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "",
			price: 10,
		})
		.expect(400);
});
it("return an error if an invalid price is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "Event",
			price: "35",
		})
		.expect(400);
});

it("create a ticket with valid inputs", async () => {
	let verifyTickets = await Ticket.find({});
	expect(verifyTickets.length).toEqual(0);
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "Event",
			price: 50,
		})
		.expect(201);
	verifyTickets = await Ticket.find({}); 
	expect(verifyTickets.length).toEqual(1);
});

