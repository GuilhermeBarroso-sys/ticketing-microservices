import { Listener, Subjects, TicketCreatedEvent } from "@gbotickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";


class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;

	queueGroupName = queueGroupName;
	async onMessage(data:  TicketCreatedEvent["data"], msg: Message): Promise<void> {
	  const {id, title, price} = data;

		const ticket = Ticket.build({
			id,
			title,
			price
		});
		ticket.id = id;
		await ticket.save();

		msg.ack();
	}

}


export { TicketCreatedListener };