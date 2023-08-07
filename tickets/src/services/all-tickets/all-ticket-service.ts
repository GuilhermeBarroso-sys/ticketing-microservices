import { Ticket } from "../../models/Ticket";

class AllTicketService {
	async execute() {
		const tickets = await Ticket.find({
			orderId: undefined
		});
		return tickets;
	}
}

export { AllTicketService };
