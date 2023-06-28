
import "sweetalert2/src/sweetalert2.scss";

import { thisIsUnsafe } from "../../utils/this-is-unsafe";
import { cookies, headers } from "next/headers";
import { LandingPage } from "@/components/LandingPage";
import { api } from "@/services/api";
import { NextRequest } from "next/server";
export type CurrentUser = {
  currentUser: {
    id: string;
    email: string;
    iat: string;
  }
}

export default async function Home() {

	const authCookie = cookies().get("session");
	api.defaults.headers.Cookie = `${authCookie?.name}=${authCookie?.value}`;
	const currentUser = await api.get<CurrentUser>("/users/currentuser");
	return <LandingPage currentUser={currentUser.data.currentUser}/>;
}