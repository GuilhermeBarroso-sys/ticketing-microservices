import { connect } from "mongoose";
import { app } from "./app";


const start = async () => {
	if(!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must to be valid");
	}
	try {
		await connect("mongodb://auth-mongo-srv:27017/auth");
		console.log("Connected to mongodb!");
	} catch(err) {
		console.error(err);
	}
	app.listen(3000, () => {

		console.log("Listening on port 3000!! NODE_ENV:", process.env.NODE_ENV);
	});
};

start();