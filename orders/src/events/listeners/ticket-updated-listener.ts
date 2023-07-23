import { Listener, Subjects, TicketUpdatedEvent } from "@gbotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;

	queueGroupName = queueGroupName;
	async onMessage(data:  TicketUpdatedEvent["data"], msg: Message): Promise<void> {
		const {id,price,title, version} = data;

		const ticket = await Ticket.findByIdAndPrevVersion({event: {
			ticketId: id,
			version
		}});
		if(!ticket) {
			throw new Error("ticket not found");
		}


		ticket.set({title, price});
		await ticket.save();
		msg.ack();
	}
}


export { TicketUpdatedListener };