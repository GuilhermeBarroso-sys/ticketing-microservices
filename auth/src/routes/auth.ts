import {Router} from "express";
import {  SignupController } from "../services/signup/signup-controller";
import { SigninController } from "../services/signin/signin-controller";
import { SignoutController } from "../services/signout/signout-controller";
import { CurrentUserController } from "../services/currentuser/currentuser-controller";
import { ensureCurrentUser } from "@gbotickets/common";
const authRoutes = Router();
authRoutes.post("/signup", async (request, response) => new SignupController().handle(request, response));
authRoutes.post("/signin",async  (request, response) => new SigninController().handle(request, response));
authRoutes.post("/signout", (request, response) => new SignoutController().handle(request,response));
authRoutes.get("/currentuser", ensureCurrentUser ,(request, response) => new CurrentUserController().handle(request,response));

export { authRoutes };