import {Request, Response, Router} from "express";
import { requireAuth } from "@gbotickets/common";
const ticketRoutes = Router();

ticketRoutes.post("/", requireAuth , (request: Request, response: Response) => {
	response.sendStatus(200);
});


export { ticketRoutes };