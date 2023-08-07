"use client";

import { Order } from "@/app/orders/[id]/page";
import { CurrentUser } from "@/app/page";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

interface IOrderDetails {
  order : Order
  currentUser : CurrentUser["currentUser"]
}
export function OrderDetails({ order, currentUser } : IOrderDetails) {
	const router = useRouter();
	const [timeLeft, setTimeLeft] = useState<number>(0);
	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt).valueOf() - new Date().valueOf();
			setTimeLeft(Math.round(msLeft / 1000));
		};
		findTimeLeft();
  
		const timerId =  setInterval(findTimeLeft, 1000);
		return () => {
			clearInterval(timerId);
		};
	}, []);
	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}
	return (
		<>

			<h1>Time left to pay: {timeLeft} seconds</h1>
			<StripeCheckout 
				token={async ({id}) => {
					const payment = await api.post("/payments", {
						"token": id,
						"orderId": order.id
					});
					if(payment.status == 201) {
						Swal.fire("success", "Paid with success!", "success");
						router.push("/");
						router.refresh();
					}
				} }
				currency="BRL"
				stripeKey="pk_test_51MV4AZFe6NHo0cuYqxOy8YqOxpRuSaHdWRERtyITYXt5ZlJOqJC1eyzTXQPww96BGS2dVK3UDq9eFtypfoCM4hvw00EPx7Dsg0"
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>
		</>
	);
}