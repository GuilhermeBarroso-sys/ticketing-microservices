"use client";
import { Order } from "@/app/orders/[id]/page";
import { MetricCard } from "@/components/Card";
import { useRouter } from "next/navigation";


interface IOrderListProps {
  orders: Order[]
}

export function OrderList({orders} : IOrderListProps) {
	const router = useRouter();
	return (
		<div className="ml-4 flex gap-2 flex-wrap w-3/4 mt-6">
			{orders.map(({id,status,ticket: {title, price}}) => {
    
				return <div className="w-100" key = {id}><MetricCard onClick={() => router.push(`/orders/${id}`)} title={title} price={price} decorationColor="pink"  description={status}/></div>;
			})}
		</div>
	);
}