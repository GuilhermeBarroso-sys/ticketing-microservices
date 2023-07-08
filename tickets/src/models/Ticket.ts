import mongoose from "mongoose";


interface ITicketSchema {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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
			delete ret.__v;
		}
	}
});




ticketSchema.statics.build = (schema : ITicketSchema) => {
	return new Ticket(schema);
};


const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };