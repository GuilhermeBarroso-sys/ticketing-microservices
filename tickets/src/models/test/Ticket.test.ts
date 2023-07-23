import { Ticket } from "../Ticket";

it("Implement optimistic concurrency control", async () => {
	const ticket = Ticket.build({
		title: "test",
		price: 5,
		userId: "123"
	});

	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id);
  
	firstInstance!.set({
		price: 10
	});
	const secondInstance = await Ticket.findById(ticket.id);
	secondInstance!.set({
		price: 20
	});

	await firstInstance!.save();
	expect(async () => await secondInstance!.save()).rejects.toThrow();

});

it("Should increment the ticket version", async () => {
	const ticket = Ticket.build({
		title: "test",
		price: 5,
		userId: "123"
	});
  
	await ticket.save();
	expect(ticket.version).toBe(0);
	ticket.set({
		price: 30
	});
	await ticket.save();
	expect(ticket.version).toBe(1);
	ticket.set({
		price: 50
	});
	await ticket.save();
	expect(ticket.version).toBe(2);

});
