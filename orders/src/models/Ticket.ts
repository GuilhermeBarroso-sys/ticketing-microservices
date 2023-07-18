import mongoose from "mongoose";
import { Order, OrderStatus } from "./Order";


interface ITicketSchema {
  title: string;
  price: number;
}

export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved: () => Promise<boolean>
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(schema : ITicketSchema) : ITicketDoc;
}


const ticketSchema = new mongoose.Schema<ITicketSchema>({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		min: 0
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;

			delete ret._id;
			delete ret.__v;
		}
	}
});




ticketSchema.statics.build = (schema : ITicketSchema) => {
	return new Ticket(schema);
};

ticketSchema.methods.isReserved = async function() {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,

			]
		}
	});

	return !!existingOrder;
};
const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };