import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";


it("has a route handler listening to /api/tickets/:id for PUT requests", async () => {
	const response = await request(app)
		.put("/api/tickets/k4124o2512g")
		.send({});
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.put("/api/tickets/k4124o2512g")
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.put("/api/tickets/k4124o2512g")
		.set("Cookie", global.getMockedCookie())
		.send({});

	expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title or price is provided", async () => {
	await request(app)
		.put("/api/tickets/k4124o2512g")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "",
			price: -5,
		})
		.expect(400);
});

it("return a status  404 if the ticket does not exist", async () => {
	await request(app)
		.put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "afsfasfs",
			price: 20
		}).expect(404);
});
it("return a status  401 if the user is not the owner of the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "afsfasfs",
			price: 20
		});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "afsfasfs",
			price: 20
		}).expect(401);
});

it("Should update a ticket ", async () => {
	const sameCookie = global.getMockedCookie();
	const ticket = await request(app)
		.post("/api/tickets")
		.set("Cookie", sameCookie)
		.send({
			title: "afsfasfs",
			price: 20
		});
	const response = await request(app)
		.put(`/api/tickets/${ticket.body.id}`)
		.set("Cookie", sameCookie)
		.send({
			title: "testt",
			price: 50,
		})
		.expect(200);
	expect(response.body.title).toEqual("testt");
	expect(response.body.price).toEqual(50);
    

});