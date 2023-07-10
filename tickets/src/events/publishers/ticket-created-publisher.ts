import { Publisher, Subjects, TicketCreatedEvent } from "@gbotickets/common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;

}


export { TicketCreatedPublisher };