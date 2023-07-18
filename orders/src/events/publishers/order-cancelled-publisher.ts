import { OrderCancelledEvent, Publisher, Subjects, TicketUpdatedEvent } from "@gbotickets/common";

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };

