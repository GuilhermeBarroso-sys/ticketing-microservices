import { TicketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";

interface INewTicket {
  title: string;
  price: number;
  userId: string
}

class NewTicketService {
	async execute(schema : INewTicket) {
		const ticket = Ticket.build(schema);
		await ticket.save();
		const {id, title,price,userId, version} = ticket;
		const publisher = new TicketCreatedPublisher(natsWrapper.client);
		await publisher.publish({
			id,
			title,
			price,
			version,
			userId
		});
		return ticket;
	}
}

export { NewTicketService };