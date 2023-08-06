import { CurrentUser } from "@/app/page";
import { api } from "@/services/api";

export async function getCurrentUser() {

	const response = await api.get<CurrentUser>("/users/currentuser");
	return response.data.currentUser;
}