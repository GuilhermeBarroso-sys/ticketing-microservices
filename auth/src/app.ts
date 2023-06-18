
import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieSession  from "cookie-session";
import { authRoutes } from "./routes/auth";
import { errorHandler } from "../middleware/error-handler";
import { NotFoundError } from "./errors/not-found-error";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));
app.use("/api/users", authRoutes);
app.all("*", (request, response, next) => {
	throw new NotFoundError();
});
app.use(errorHandler);



export { app };