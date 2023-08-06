"use client";
import { Order } from "@/app/orders/[id]/page";
import { Ticket } from "@/components/LandingPage";
import { api } from "@/services/api";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Swal from "sweetalert2";
import { showError } from "../../../../utils/showError";

interface ITicketDetailsProps {
  ticket: Ticket
  currency?: string
  isAuthenticated: boolean
}


export function TicketDetails({ticket, currency, isAuthenticated} : ITicketDetailsProps) {
	const router = useRouter();

	const handleSubmit =  async (e : FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(!isAuthenticated) {
			Swal.fire("Error", "You need to be authenticated to buy a ticket.", "error");
			return;
		}
		try {

			const {data : order } = await api.post<Order>("/orders", {
				ticketId: ticket.id
			});
			Swal.fire("Success", "Order created with success!", "success").then(() => {
				router.push(`/orders/${order.id}`);
				router.refresh();
			});
		} catch(error : any) {
			console.log(error.message);
			showError({error});
		}
	};
	return (
		<div className="flex mt-10 justify-start ml-14">
			<form
				className="w-full max-w-md "
				onSubmit={handleSubmit}
			>
				<h1 className="text-2xl font-bold">{ticket.title}</h1>
				<p> <strong>Price: </strong> {currency ? currency : "R$"} {ticket.price}</p>
				<p> <strong>Status: </strong> </p>
				<Button className="mt-4" variant="primary">Purchase</Button>
			</form>
		</div>
	);
}