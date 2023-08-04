import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
	
	try {
		await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
		natsWrapper.client.on("close", () => {
			console.log("Nats connection closed!");
			process.exit();
		});
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());
		console.log(process.env.REDIS_HOST);
		new OrderCreatedListener(natsWrapper.client).listen();

	} catch(err) {
		console.error(err);
	}
};

start();