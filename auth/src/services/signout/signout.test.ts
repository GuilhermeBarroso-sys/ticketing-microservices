import request from "supertest";
import {app} from "../../app";


it("Shouldn't return a cookie", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "password"
		});
	const response = await request(app)
		.post("/api/users/signout")
		.expect(204);
	const [sessionKey] = response.get("Set-Cookie");

	const [session] = sessionKey.split(" ");
	expect(session).toBe("session=;");  
});