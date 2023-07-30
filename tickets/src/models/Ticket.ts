import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface ITicketSchema {
  title: string;
  price: number;
  userId: string;
}
interface IFindByIdAndPrevVersionProps {
  event: {
    ticketId: string;
    version: number;
  }
}
interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(schema : ITicketSchema) : ITicketDoc;
  findByIdAndPrevVersion (data : IFindByIdAndPrevVersionProps) : Promise<ITicketDoc | null>
  
}


const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	orderId: {
		type: String,
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
});

ticketSchema.statics.findByIdAndPrevVersion = async ({event} : IFindByIdAndPrevVersionProps) => {
	const {ticketId,version} = event;
	return Ticket.findOne({
		_id: ticketId,
		version: version - 1
	});
};
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (schema : ITicketSchema) => {
	return new Ticket(schema);
};


const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };