"use client";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/app/services/api";
import Swal from "sweetalert2";
import { ApiError } from "next/dist/server/api-utils";
export default function signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ApiError[]>([]);
	useEffect(() => {
		console.log(errors.length);
		if(errors.length) {
			const errorMessage =  errors.map((error) => {
				return `• ${error.message}`;
			}).join("\n");
			Swal.fire("Error", `${errorMessage}`, "error");
		}
	}, [errors]);
	const handleSubmit =  async (e : FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await api.post("/users/signup", {
				email, password
			});
		} catch(err : any) {
			setErrors(err.response.data.errors);
		}
		setEmail("");
		setPassword("");
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<form
				className="w-full max-w-md "
				onSubmit={handleSubmit}
			>
				<h2 className="text-2xl text-gray-800 text-center font-bold mb-6">Sign up</h2>
				<div className="bg-white rounded-lg shadow-md p-6">

					<div className="mb-4">
				
					</div>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500"
							placeholder="Your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
						</label>
						<input
							type="password"
							id="password"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500"
							placeholder="Your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-300"
					>
          Sign up
					</button>
				</div>
			</form>
		</div>
	);

}