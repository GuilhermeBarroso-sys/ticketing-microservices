"use client";

import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";
import { showError } from "../../../../utils/showError";

export function NewTicket() {
	const router = useRouter();
	const [ticketName, setTicketName] = useState("");
	const [price, setPrice] = useState<number|null>(null);
	const [invalidPrice, setInvalidPrice] = useState(true);
	const handleSubmit =  async (e : FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {

			await api.post("/tickets", {
				title: ticketName,
				price
			});
			Swal.fire("Success", "Ticket created with success!", "success").then(() => {
				router.push("/");
				router.refresh();
			});
		} catch(error : any) {
			console.log(error.message);
			showError({error});
		}
		setTicketName("");
		setPrice(null);
	};
	return (
		<div className="flex justify-center items-center h-[85vh]">
			<form
				className="w-full max-w-md "
				onSubmit={handleSubmit}
			>
				<h2 className="text-2xl text-gray-800 text-center font-bold mb-6">New Ticket</h2>
				<div className="bg-white rounded-lg shadow-md p-6">

					<div className="mb-4">
						
					</div>
					<div className="mb-4">
						<label htmlFor="ticketName" className="block text-gray-700 font-bold mb-2">
            Ticket Name
						</label>
						<input
							type="text"
							id="ticketName"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500"
							placeholder="E.g Indie summer"
							value={ticketName}
							onChange={(e) => setTicketName(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Price
						</label>
						<input
							type="number"
							step={"0.01"}
							id="price"
							className={`w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none ${invalidPrice ? "focus:border-red-500" : "focus:border-purple-500"}`}
							onFocus={(event) => {
								if(!event.target.value) {
									setInvalidPrice(true);
									return;
								}
							
								setInvalidPrice(parseFloat(event.target.value) <= 0 ? true : false);
							}}
							onBlur={(event) => {
								console.log(event.target.value);
								if(!event.target.value) {
									setInvalidPrice(true);
									return;
								}
								setInvalidPrice(parseFloat(event.target.value) <= 0 ? true : false);
							}}
							onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
							required
						/>
						{invalidPrice && <small className="text-red-400">Price should be bigger than 0</small>}
					</div>
					<button
						type="submit"
						className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-300"
					>
          New Ticket
					</button>

					
				</div>
			</form>
		</div>
	);
}