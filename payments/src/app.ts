
import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieSession  from "cookie-session";
import { NotFoundError, ensureCurrentUser, errorHandler } from "@gbotickets/common";
import { paymentsRoutes } from "./routes/payments";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));

app.use("/api/payments", paymentsRoutes);
app.all("*", (request, response, next) => {
	console.log("aaaa");
	throw new NotFoundError();
});
app.use(errorHandler);



export { app };