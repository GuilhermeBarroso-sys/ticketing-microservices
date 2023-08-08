import axios from "axios";

export const api = typeof window == "undefined" ? axios.create({
	baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api",
	headers: {
		Host: "ticketing.dev"
	}
})
	: 
	axios.create({ baseURL: "/api"});

  

