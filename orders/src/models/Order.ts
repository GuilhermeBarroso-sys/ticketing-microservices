
import mongoose from "mongoose";
import {ITicketDoc} from "./Ticket";
import { OrderStatus } from "@gbotickets/common";
export { OrderStatus };
interface IOrderSchema {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
}

interface IOrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;

}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(schema : IOrderSchema) : IOrderDoc;
}


const orderSchema = new mongoose.Schema<IOrderSchema>({
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(OrderStatus),
		default: OrderStatus.Created
	},
	expiresAt: {
		type: mongoose.Schema.Types.Date
	},
	ticket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ticket"
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;

			delete ret._id;

		}
	}
});




orderSchema.statics.build = (schema : IOrderSchema) => {
	return new Order(schema);
};


const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };