import axios from "axios";

export const api = typeof window == "undefined" ? axios.create({
	baseURL: "http://www.testgui.beauty/api",
	headers: {
		Host: "www.testgui.beauty"
	}
})
	: 
	axios.create({ baseURL: "http://www.testgui.beauty/api"});



