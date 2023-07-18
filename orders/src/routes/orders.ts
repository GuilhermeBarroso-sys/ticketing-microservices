import {Request, Response, Router} from "express";
import { ensureCurrentUser, requireAuth } from "@gbotickets/common";
import { AllOrderController } from "../services/all-order/all-order-controller";
import { NewOrderController } from "../services/new-order/new-order-controller";
import { ShowOrderController } from "../services/show-order/show-order-controller";
import { DeleteOrderController } from "../services/delete-order/delete-order-controller";
const ordersRoutes = Router();

ordersRoutes.post("/", (request: Request, response: Response) => new NewOrderController().handle(request,response));
ordersRoutes.get("/", (request: Request, response: Response) => new AllOrderController().handle(request,response));
ordersRoutes.get("/:orderId", (request: Request, response: Response) => new ShowOrderController().handle(request,response));
ordersRoutes.delete("/:orderId", (request: Request, response: Response) => new DeleteOrderController().handle(request,response));




export { ordersRoutes };