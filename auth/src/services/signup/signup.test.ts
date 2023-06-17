import request from "supertest";
import {app} from "../../app";
it("Returns a 201 on successful signup", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "password"
		})
		.expect(201);
});

it("should return a 400 with an invalid email",  async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "testgmail.com",
			password: "password"
		})
		.expect(400);
});

it("should return a 400 with an invalid password",  async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "123"
		})
		.expect(400);
});

it("should disallows duplicate emails", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "1234"
		})
		.expect(201);

	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "1234"
		})
		.expect(400);
});


it("Should sets a cookie after successful signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "1234"
		})
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});