import { api } from "@/services/api";
import { cookies } from "next/headers";

export function setCookie() {
	const authCookie = cookies().get("session") ;
	api.defaults.headers.Cookie = `${authCookie?.name}=${authCookie?.value}`;
}