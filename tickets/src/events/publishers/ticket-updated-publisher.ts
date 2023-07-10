import { Publisher, Subjects, TicketUpdatedEvent } from "@gbotickets/common";

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };