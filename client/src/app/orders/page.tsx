
import "sweetalert2/src/sweetalert2.scss";

import { OrderList } from "@/components/Order/OrderList";
import { api } from "@/services/api";
import { setCookie } from "../../../utils/setCookie";
import { Order } from "./[id]/page";

export type CurrentUser = {
  currentUser: {
    id: string;
    email: string;
    iat: string;
  }
}

export default async function Page() {
	try {
		setCookie();
		const {data : orders} = await api.get<Order[]>("/orders");
		return  <OrderList orders={orders}/>;
	} catch(err) {
		return <h1>Something is wrong</h1>;
	}


}