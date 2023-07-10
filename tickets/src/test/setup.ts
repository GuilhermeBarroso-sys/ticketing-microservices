import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongo : MongoMemoryServer;
import { sign } from "jsonwebtoken";
declare global {
  var getMockedCookie: () => string[];
}

jest.mock("../nats-wrapper");
jest.mock("../events/publishers/ticket-created-publisher.ts");
jest.mock("../events/publishers/ticket-updated-publisher.ts");

beforeAll(async () => {
	process.env.JWT_KEY = "test";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri, {});

});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});
global.getMockedCookie =  () => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: "test@gmail.com"
	};
	const token =  sign(payload, process.env.JWT_KEY as string);
	const session = {jwt: token};
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");
	return [`session=${base64}`];
};

afterAll(async () => {
	if(mongo) {
		await mongo.stop();
		await mongoose.connection.close();
	}
});

