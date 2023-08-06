"use client";
import Link from "next/link";
import { TicketList } from "../Tickets/TicketList";
type  CurrentUser = {
  id: string;
  email: string;
  iat: string;
}
export type Ticket = {
  id: string;
  title: string
  price: number;
  userId: string;
  version: number;
}
interface ILandingPageProps {
  currentUser: CurrentUser
  tickets: Array<Ticket> | []
}
export function LandingPage({currentUser,tickets} : ILandingPageProps) {

	return (
		<main className="flex mt-12 flex-col items-center ">

			{currentUser ? <h1>You're signed in {currentUser.email}!</h1> : <h1>you're not signed in, <Link href={"/auth/signin"} className="text-blue-700 font-bold"> Click here to sign in</Link></h1>}
			<div className="flex gap-2 flex-wrap w-3/4">
				<TicketList tickets={tickets}/>
			</div>
			
		</main>
	);

}