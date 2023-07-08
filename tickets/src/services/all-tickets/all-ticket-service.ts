import { NotFoundError } from "@gbotickets/common";
import { Ticket } from "../../models/Ticket";

class AllTicketService {
	async execute() {
		const tickets = await Ticket.find();
		return tickets;
	}
}

export { AllTicketService };