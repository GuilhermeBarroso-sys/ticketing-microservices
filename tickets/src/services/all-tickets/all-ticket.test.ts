import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/tickets/ for GET requests", async () => {
	const response = await request(app)
		.get("/api/tickets")
		.send({});
	expect(response.status).not.toEqual(404);
});

// it("can only be accessed if the user is signed in", async () => {
// 	await request(app)
// 		.get("/api/tickets")
// 		.send({})
// 		.expect(401);
// });

// it("return a status other than 401 if the user is signed in", async () => {
// 	const response = await request(app)
// 		.get("/api/tickets")
// 		.set("Cookie", global.getMockedCookie())
// 		.send({});

// 	expect(response.status).not.toEqual(401);
// });
it("Shouldn't return tickets", async () => {
	const response = await request(app)
		.get("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.expect(200);

	expect(response.body.length).toEqual(0);
});
it("Should return tickets", async () => {
	for(let i = 0; i < 3; i++) {
		await request(app)
			.post("/api/tickets")
			.set("Cookie", global.getMockedCookie())
			.send({
				title: "Event",
				price: 50,
			})
			.expect(201);
	}

	const response = await request(app)
		.get("/api/tickets")
		.set("Cookie", global.getMockedCookie())
		.expect(200);

	expect(response.body.length).toBeGreaterThan(1);
});