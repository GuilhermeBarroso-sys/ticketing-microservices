import { Ticket } from "@/components/LandingPage";
import { TicketDetails } from "@/components/Tickets/TicketDetails";
import { api } from "@/services/api";
import { cookies } from "next/headers";
interface PageProps {
  params: {
    id: string;
  },
}
export default async function Page({params} : PageProps) {
	try {
		const {id} = params;
		const isAuthenticated = cookies().has("session");
		const {data : ticket} = await api.get<Ticket>(`/tickets/${id}`);

		return <TicketDetails ticket={ticket} isAuthenticated = {isAuthenticated}/>;
	} catch(err) {
		return <h1>Error</h1>;
	}
}