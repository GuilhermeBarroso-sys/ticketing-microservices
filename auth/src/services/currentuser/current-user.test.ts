
import request from "supertest";
import { app } from "../../app";
it("should return 'currentUser' attribute on response body ", async () => {
	
	const cookie = await global.getMockedCookie();
	const response = await request(app)
		.get("/api/users/currentuser")
		.expect(200)
		.set("Cookie", cookie);

	expect(response.body).toHaveProperty("currentUser");
	expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("should return null if not authenticated", async () => {
	

	const response = await request(app)
		.get("/api/users/currentuser")
		.expect(200);

	expect(response.body).toHaveProperty("currentUser");

	expect(response.body.currentUser).toBeNull();
});