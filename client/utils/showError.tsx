import { ApiError } from "next/dist/server/api-utils";
import Swal from "sweetalert2";
interface IUseRequestProps {
  error: any
}
export function showError({error} : IUseRequestProps) {
	const errorMessage =  error?.response?.data?.errors ? error.response.data.errors.map((error : ApiError) => {
		return `• ${error.message}`;
	}).join("\n") : "Something is wrong, try again later";
	Swal.fire("Error", `${errorMessage}`, "error");

}