"use client";

import { api } from "@/services/api";
import { useRouter } from "next/navigation";
interface ISignoutButtonProps {
  children: React.ReactNode
}
export function SignoutButton({children} : ISignoutButtonProps) {
	const router = useRouter();
	async function signout() {

		await api.post("/users/signout");
		router.refresh();
	}
	return <button onClick={signout} className="font-bold text-slate-200 text-lg hover:text-slate-100">{children}</button>;
}