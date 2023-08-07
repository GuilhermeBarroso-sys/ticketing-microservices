import { OrderDetails } from "@/components/Order/OrderDetails";
import { api } from "@/services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { setCookie } from "../../../../utils/setCookie";
interface PageProps {
  params: {
    id: string;
  },
}
export interface Order {
  userId: string,
	status: string,
	expiresAt: string,
	ticket: {
		title: string,
		price: number,
		version: number,
		id: string
	},
	version: number,
	id: string
}
export default async function Page({params} : PageProps) {
	try {
		const {id} = params;
		const isAuthenticated = cookies().has("session");
		if(!isAuthenticated) {
			redirect("/");
		}
		setCookie();
		const {data : order} = await api.get<Order>(`/orders/${id}`);
		const currentUser = await getCurrentUser();
		return <OrderDetails order={order} currentUser={currentUser}/>;
	} catch(err) {
		return <h1>Error</h1>;
	}
}