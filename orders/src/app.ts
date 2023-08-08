
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import "express-async-errors";
// import { authRoutes } from "./routes/auth";
import { NotFoundError, ensureCurrentUser, errorHandler, requireAuth } from "@gbotickets/common";
import { ordersRoutes } from "./routes/orders";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(cookieSession({
	signed: false,
	secure: false
}));

app.use("/api/orders", ensureCurrentUser, requireAuth, ordersRoutes);
app.all("*", (request, response, next) => {
	throw new NotFoundError();
});
app.use(errorHandler);



export { app };
