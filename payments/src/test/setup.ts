import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongo : MongoMemoryServer;

import { sign, verify } from "jsonwebtoken";
import { stripe } from "../adapters/stripe";
interface GetMockedCookieId {
  id: string;
  email: string;
  iat: number
}
declare global {
  var getMockedCookie: () => string[];
  var getMockedCookieId: (cookie: Array<string>) => GetMockedCookieId;
}

jest.mock("../nats-wrapper");
// jest.mock("../adapters/stripe.ts");
process.env.STRIPE_KEY = "sk_test_51MV4AZFe6NHo0cuYH7s6FzGd1g8wceX7uS9S1ZnUec2BRYtiILHGe43k4dEEgyIjskCYQBDpbKmIBmC97zxU2CGH00ipj4UaSW";


beforeAll(async () => {
	process.env.JWT_KEY = "test";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri, {});
  
});

beforeEach(async () => {
	jest.spyOn(console, "error").mockImplementation(() => {});
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
global.getMockedCookieId = (cookie : Array<string>) => {
	const base64 = cookie[0].split("=")[1];
	const {jwt} = JSON.parse(Buffer.from(base64, "base64").toString());
	const payload = verify(jwt, process.env.JWT_KEY as string) as GetMockedCookieId;
	return payload;

};
afterAll(async () => {
	if(mongo) {
		await mongo.stop();
		await mongoose.connection.close();
	}
});

