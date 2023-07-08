import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";


it("has a route handler listening to /api/tickets/:ticketId for GET requests", async () => {
	const ticketCreated = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "Event",
			price: 50,
		})
		.expect(201);
	const response = await request(app)
		.get(`/api/tickets/${ticketCreated.body.id}`)
		.send({});
	expect(response.status).not.toEqual(404);
});

// it("can only be accessed if the user is signed in", async () => {
// 	await request(app)
// 		.get("/api/tickets/124opk214214124k")
// 		.send({})
// 		.expect(401);
// });

// it("return a status other than 401 if the user is signed in", async () => {
// 	const response = await request(app)
// 		.get("/api/tickets/124opk214214124k")
// 		.set("Cookie", global.getMockedCookie())
// 		.send({});

// 	expect(response.status).not.toEqual(401);
// });

it("Shouldn't return an ticket", async () => {
	await request(app)
		.get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.getMockedCookie())
		.expect(404);

});

it("Should return an ticket", async () => {
	const ticketCreated = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.send({
			title: "Event",
			price: 50,
		})
		.expect(201);
	console.log(ticketCreated.body.id);
	const response = await request(app)
		.get(`/api/tickets/${ticketCreated.body.id}`)
		.set("Cookie", global.getMockedCookie())
		.expect(200);
	expect(response.body.id).toBe(ticketCreated.body.id);
});