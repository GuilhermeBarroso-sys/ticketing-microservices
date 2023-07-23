import mongoose from "mongoose";
import { Order, OrderStatus } from "./Order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface ITicketSchema {
  id: string;
  title: string;
  price: number;
}

export interface ITicketDoc extends mongoose.Document {
  title: string;
  version: number;
  price: number;
  isReserved: () => Promise<boolean>
}
interface IFindByIdAndPrevVersionProps {
  event: {
    ticketId: string;
    version: number;
  }
}
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(schema : ITicketSchema) : ITicketDoc;
  findByIdAndPrevVersion (data : IFindByIdAndPrevVersionProps) : Promise<ITicketDoc | null>
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

		}
	}
});
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.findByIdAndPrevVersion = async ({event} : IFindByIdAndPrevVersionProps) => {
	const {ticketId,version} = event;
	return Ticket.findOne({
		_id: ticketId,
		version: version - 1
	});
};
ticketSchema.statics.build = (schema : ITicketSchema) => {
	return new Ticket({
		_id: schema.id,
		title: schema.title,
		price: schema.price
	});
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