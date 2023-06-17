import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongo : MongoMemoryServer;
import request from "supertest";
import { app } from "../app";
declare global {
  var getMockedCookie: () => Promise<string[]>;
}
beforeAll(async () => {
	process.env.JWT_KEY = "test";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri, {});

});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});
global.getMockedCookie = async () => {
	const email = "test@gmail.com";
	const password = "password";

	const response = await request(app).post("/api/users/signup")
		.send({
			email,password
		})
		.expect(201);

	const cookie = response.get("Set-Cookie");
	return cookie;
};

afterAll(async () => {
	if(mongo) {
		await mongo.stop();
		await mongoose.connection.close();
	}
});

