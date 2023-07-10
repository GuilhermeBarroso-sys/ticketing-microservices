import { NotAuthorizedError, NotFoundError } from "@gbotickets/common";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

interface IUpdateTicket {
  title: string;
  price: number;
  userId: string
  ticketId: string;
}

class UpdateTicketService {
	async execute({ticketId, userId, title, price} : IUpdateTicket) {
		const ticket = await Ticket.findById(ticketId);
		if(!ticket) {
			throw new NotFoundError();
		}
		if(ticket?.userId !== userId) {
			throw new NotAuthorizedError();
		}
		ticket.set({
			title,
			price
		});
		await ticket.save();
	
		new TicketUpdatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId
		});
		return ticket;
	
	}
}

export { UpdateTicketService };