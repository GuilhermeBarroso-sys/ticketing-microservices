
import mongoose from "mongoose";
import { OrderStatus } from "@gbotickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export { OrderStatus };
interface IOrderSchema {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface IOrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;

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
	price: {
		type: mongoose.Schema.Types.Number
	},
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;

			delete ret._id;

		}
	}
});


orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (schema : IOrderSchema) => {
	return new Order({
		_id: schema.id,
		version: schema.version,
		price: schema.price,
		userId: schema.userId,
		status: schema.status
	});
};


const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };