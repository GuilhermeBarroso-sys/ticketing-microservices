import { NotAuthorizedError, NotFoundError } from "@gbotickets/common";
import { Ticket } from "../../models/Ticket";

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
			console.log("aaaaaaa");
			throw new NotAuthorizedError();
		}
		ticket.set({
			title,
			price
		});
		await ticket.save();
		return ticket;
	
	}
}

export { UpdateTicketService };