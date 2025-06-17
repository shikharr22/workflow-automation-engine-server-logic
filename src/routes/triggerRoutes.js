import { Router } from "express";
import { triggerWorkflow } from "../controllers/triggerController.js";

const router = new Router();

router.post("/:workflowId", triggerWorkflow);

export default router;
