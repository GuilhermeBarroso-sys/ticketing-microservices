import request from "supertest";
import {app} from "../../app";


it("should return a 400 with an invalid email param",  async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "testgmail.com",
			password: "password"
		})
		.expect(400);
});


it("should return a 400 with an invalid password param",  async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@gmail.com",
			password: "123"
		})
		.expect(400);
});


it("Should fails when a email that doesn't exist is supplied",  async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@gmail.com",
			password: "password"
		})
		.expect(400);
});

it("Should fails when user type a wrong password",  async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "password"
		});
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@gmail.com",
			password: "password1"
		})
		.expect(400);
});

it("Should return a cookie when given valid credentials",  async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "password"
		});
	const response = await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@gmail.com",
			password: "password"
		})
		.expect(200);
	expect(response.get("Set-Cookie")).toBeDefined();

});