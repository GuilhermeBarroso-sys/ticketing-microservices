import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentSchema {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(schema : PaymentSchema) : PaymentDoc;
}

const paymentSchema = new mongoose.Schema<PaymentDoc>({
	orderId: {
		type: String,
		required: true,
	},
	stripeId: {
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


paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (schema : PaymentSchema) => {
	return new Payment(schema);
};


const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };