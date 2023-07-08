import { NotFoundError } from "@gbotickets/common";
import { Ticket } from "../../models/Ticket";

interface INewTicket {
  ticketId: string;
}

class ShowTicketService {
	async execute({ticketId} : INewTicket) {
		const ticket = await Ticket.findById(ticketId);
		if(!ticket) throw new NotFoundError();
		return ticket;
	}
}

export { ShowTicketService };