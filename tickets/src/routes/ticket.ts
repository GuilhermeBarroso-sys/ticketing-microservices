import {Request, Response, Router} from "express";
import { ensureCurrentUser, requireAuth } from "@gbotickets/common";
import { NewTicketController } from "../services/new-ticket/new-ticket-controller";
import { ShowTicketController } from "../services/show-ticket/show-ticket-controller";
import { AllTicketController } from "../services/all-tickets/all-ticket-controller";
import { UpdateTicketController } from "../services/update-ticket/update-ticket-controller";
const ticketRoutes = Router();

ticketRoutes.post("/", ensureCurrentUser , requireAuth, (request: Request, response: Response) => new NewTicketController().handle(request,response));
ticketRoutes.get("/", (request: Request, response: Response) => new AllTicketController().handle(request,response));
ticketRoutes.get("/:ticketId", (request: Request, response: Response) => new ShowTicketController().handle(request,response));
ticketRoutes.put("/:ticketId", ensureCurrentUser,requireAuth, (request: Request, response: Response) => new UpdateTicketController().handle(request,response));



export { ticketRoutes };