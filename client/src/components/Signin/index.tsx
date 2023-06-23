"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { showError } from "../../../utils/showError";
import { api } from "@/services/api";
import Link from "next/link";
export function Signin() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit =  async (e : FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await api.post("/users/signin", {
				email, password
			});
			router.push("/");
			router.refresh();
		} catch(error : any) {
			console.log(error.message);
			showError({error});
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
				<h2 className="text-2xl text-gray-800 text-center font-bold mb-6">Sign in</h2>
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
          Sign in
					</button>
					<h3 className="mt-6 text-base"> Doesn't have an account? <Link className="font-bold text-purple-500" href="/auth/signup">Click here</Link></h3>
				</div>
			</form>
		</div>
	);
}