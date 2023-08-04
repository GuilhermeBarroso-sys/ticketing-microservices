import { connect } from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";


const start = async () => {
	if(!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must to be valid");
	}
	try {
		await connect(process.env.MONGO_URI as string);
		await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
		console.log("Mongo connected!");
		natsWrapper.client.on("close", () => {
			console.log("Nats connection closed!");
			process.exit();
		});
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());
		new OrderCreatedListener(natsWrapper.client).listen();
		new OrderCancelledListener(natsWrapper.client).listen();

	} catch(err) {
		throw new Error("MONGO NOT CONNECTED!");
	}
	app.listen(3000, () => {
		console.log("Listening on port 3000! NODE_ENV:", process.env.NODE_ENV);
	});
};

start();