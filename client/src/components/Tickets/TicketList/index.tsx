"use client";
import { MetricCard } from "@/components/Card";
import { Ticket } from "@/components/LandingPage";
import { useRouter } from "next/navigation";


interface ITicketListProps {
  tickets: Ticket[]
}

export function TicketList({tickets} : ITicketListProps) {
	const router = useRouter();
	return tickets.map(({id,price,title}) => {

		return <div className="w-100" key = {id}><MetricCard onClick={() => router.push(`/tickets/${id}`)} title={title} price={price} decorationColor="indigo" /></div>;
	});
}