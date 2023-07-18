import { NotFoundError } from "@gbotickets/common";
import { Order } from "../../models/Order";


interface IAllOrderService {
  userId: string;
}
class AllOrderService {
	async execute({userId}: IAllOrderService) {
		const orders = await Order.find({
			userId
		}).populate("ticket");
		return orders;
	}
}

export { AllOrderService };