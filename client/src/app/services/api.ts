import axios from "axios";
// console.log(import.meta.env.API_KEY);
export const api = axios.create({
	baseURL: "https://ticketing.dev/api" 
});