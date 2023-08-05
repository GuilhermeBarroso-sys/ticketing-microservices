import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/Order";
import mongoose from "mongoose";
import { stripe } from "../../adapters/stripe";
import { Payment } from "../../models/Payment";





it("has a route handler listening to /api/payments for post requests", async () => {
	const response = await request(app)
		.post("/api/payments")
		.send({});
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app)
		.post("/api/payments")
		.send({})
		.expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.post("/api/payments")
		.set("Cookie", global.getMockedCookie())
		.send({});
	expect(response.status).not.toEqual(401);
});

it("return an error if an required param is not provided", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.getMockedCookie())
		.send({})
		.expect(400);
});

it("return an error if the params is not a string", async () => {
	const response = await request(app)
		.post("/api/payments")
		.set("Cookie", global.getMockedCookie())
		.send({
			orderId: 1,
			token: 2,
		})
		.expect(400);
	expect(response.body.errors.length).toBe(2);
});

it("return an error if the order does not exist", async () => {
	const response = await request(app)
		.post("/api/payments")
		.set("Cookie", global.getMockedCookie())
		.send({
			orderId: new mongoose.Types.ObjectId().toHexString(),
			token: "oko12k4ok412k4",
		})
		.expect(404);
});

it("return an error if the payment userId is not the owner of the order", async () => {
	const cookie = global.getMockedCookie();

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 50,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 1
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", cookie)
		.send({
			orderId: order.id,
			token: "oko12k4ok412k4",
		})
		.expect(401);
	
});

it("Should not to pay if the order has cancelled status", async () => {
	const cookie = global.getMockedCookie();
	const {id : userId} = global.getMockedCookieId(cookie);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 50,
		status: OrderStatus.Cancelled,
		userId,
		version: 1
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", cookie)
		.send({
			orderId: order.id,
			token: "oko12k4ok412k4",
		})
		.expect(400);
});
it("Shouldn't create the payment if an invalid token is provided", async () => {
	const cookie = global.getMockedCookie();
	const {id : userId} = global.getMockedCookieId(cookie);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 50,
		status: OrderStatus.Created,
		userId,
		version: 1
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", cookie)
		.send({
			orderId: order.id,
			token: "invalid_token_visa",
		})
		.expect(500);


});

it("Should create the payment without problems", async () => {
	const randomPrice = Math.floor(Math.random() * 100000);
	const cookie = global.getMockedCookie();
	const {id : userId} = global.getMockedCookieId(cookie);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: randomPrice,
		status: OrderStatus.Created,
		userId,
		version: 1
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", cookie)
		.send({
			orderId: order.id,
			token: "tok_visa",
		})
		.expect(201);
  
	const stripeCharges = await stripe.charges.list({limit : 50});
	const stripeCharge = stripeCharges.data.find(charge => charge.amount === randomPrice * 100);
	expect(stripeCharge).toBeDefined();
	expect(stripeCharge!.currency).toEqual("brl");
	const payment = await Payment.findOne({
		orderId: order.id,
		stripeId: stripeCharge!.id
	});
	expect(payment).toBeDefined();
});

it("Should return the payment and order id", async () => {
	const randomPrice = Math.floor(Math.random() * 100000);
	const cookie = global.getMockedCookie();
	const {id : userId} = global.getMockedCookieId(cookie);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: randomPrice,
		status: OrderStatus.Created,
		userId,
		version: 1
	});
	await order.save();
	const response = await request(app)
		.post("/api/payments")
		.set("Cookie", cookie)
		.send({
			orderId: order.id,
			token: "tok_visa",
		})
		.expect(201);
	expect(response.body.orderId).toBeDefined();
	expect(response.body.paymentId).toBeDefined();

});