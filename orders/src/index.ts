import { connect } from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
	if(!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must to be valid");
	}
	try {
		console.log("Starting...");
		await connect(process.env.MONGO_URI as string);
		await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
		console.log("Mongo connected!");
		natsWrapper.client.on("close", () => {
			console.log("Nats connection closed!");
			process.exit();
		});
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		new TicketCreatedListener(natsWrapper.client).listen();

		new TicketUpdatedListener(natsWrapper.client).listen();

		new ExpirationCompleteListener(natsWrapper.client).listen();

		new PaymentCreatedListener(natsWrapper.client).listen();

	} catch(err) {
		throw new Error("MONGO NOT CONNECTED!");
	}
	app.listen(3000, () => {
		console.log("Listening on port 3000! NODE_ENV:", process.env.NODE_ENV);
	});
};

start();