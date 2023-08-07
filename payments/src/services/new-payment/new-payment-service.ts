import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@gbotickets/common";
import { stripe } from "../../adapters/stripe";
import { PaymentCreatedPublisher } from "../../events/publishers/payment-created-publisher";
import { Order } from "../../models/Order";
import { Payment } from "../../models/Payment";
import { natsWrapper } from "../../nats-wrapper";

interface INewPaymentService {
  token: string;
  orderId: string;
  userId: string;
}
class NewPaymentService {
	private EXPIRATION_WINDOW_SECONDS = 15 * 60;
	async execute({orderId,token,userId} : INewPaymentService) {
		const order = await Order.findById(orderId);
		if(!order) throw new NotFoundError();
		if (order.userId !== userId ) throw new NotAuthorizedError();
		if(order.status === OrderStatus.Cancelled) throw new BadRequestError("Cannot pay for an cancelled order");
		if(order.status === OrderStatus.Complete) throw new BadRequestError("Cannot pay for an Completed order");

		const charge = await stripe.charges.create({
			currency: "brl",
			amount: order.price * 100,
			source: token,
		});
		const payment = Payment.build({
			stripeId: charge.id,
			orderId
		});
		await payment.save();
		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			stripeId: charge.id,
			orderId
		});
		return {paymentId: payment.id, orderId};
	}
}

export { NewPaymentService };
