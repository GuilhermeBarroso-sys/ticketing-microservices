import { Ticket } from "../../models/Ticket";

interface INewTicket {
  title: string;
  price: number;
  userId: string
}

class NewTicketService {
	async execute(schema : INewTicket) {
		const ticket = Ticket.build(schema);
		await ticket.save();
		return ticket;
	}
}

export { NewTicketService };