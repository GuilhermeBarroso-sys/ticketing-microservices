import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface ITicketSchema {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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
		required: true
	},
	userId: {
		type: String,
		required: true
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
ticketSchema.statics.build = (schema : ITicketSchema) => {
	return new Ticket(schema);
};


const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };