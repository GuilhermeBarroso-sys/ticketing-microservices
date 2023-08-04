import { PaymentCreatedEvent, Publisher, Subjects } from "@gbotickets/common";

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated; 

}

export { PaymentCreatedPublisher };