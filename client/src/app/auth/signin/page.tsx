import { Signin } from "@/components/Signin";
import { api } from "@/services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FormEvent } from "react";


export default async function Page() {
	const isAlreadyAuthenticated = cookies().has("session");
	console.log(isAlreadyAuthenticated);
	if(isAlreadyAuthenticated) {
		redirect("/");
	}
	return <Signin />;
}