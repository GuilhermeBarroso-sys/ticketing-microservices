"use client";

import { Order } from "@/app/orders/[id]/page";
import { useEffect, useState } from "react";

interface IOrderDetails {
  order : Order
}
export function OrderDetails({ order } : IOrderDetails) {
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
	return <h1>Time left to pay: {timeLeft} seconds</h1>;
}