
import "sweetalert2/src/sweetalert2.scss";

import { LandingPage, Ticket } from "@/components/LandingPage";
import { api } from "@/services/api";
import { cookies } from "next/headers";

export type CurrentUser = {
  currentUser: {
    id: string;
    email: string;
    iat: string;
  }
}

export default async function Home() {
	try {
		const authCookie = cookies().get("session") ;
		api.defaults.headers.Cookie = `${authCookie?.name}=${authCookie?.value}`;
		const currentUser = await api.get<CurrentUser>("/users/currentuser");
		const tickets = await api.get<Ticket[]>("/tickets");
		return <LandingPage currentUser={currentUser.data.currentUser} tickets={tickets.data}/>;
	} catch(err) {
		return <h1>Something is wrong</h1>;
	}


}