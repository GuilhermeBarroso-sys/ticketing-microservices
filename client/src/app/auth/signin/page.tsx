import { Signin } from "@/components/Auth/Signin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export default async function Page() {
	const isAlreadyAuthenticated = cookies().has("session");
	console.log(isAlreadyAuthenticated);
	if(isAlreadyAuthenticated) {
		redirect("/");
	}
	return <Signin />;
}