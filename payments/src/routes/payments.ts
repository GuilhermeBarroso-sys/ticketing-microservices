import { ensureCurrentUser, requireAuth } from "@gbotickets/common";
import {Request, Response, Router} from "express";
import { NewPaymentController } from "../services/new-payment/new-payment-controller";

const paymentsRoutes = Router();

paymentsRoutes.post("/", ensureCurrentUser,requireAuth, (request: Request, response: Response) => new NewPaymentController().handle(request,response));




export { paymentsRoutes };