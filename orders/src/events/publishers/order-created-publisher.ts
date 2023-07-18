import { OrderCreatedEvent, Publisher, Subjects, TicketCreatedEvent } from "@gbotickets/common";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;

}


export { OrderCreatedPublisher };

