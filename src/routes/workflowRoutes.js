import { Router } from "express";
import {
  createWorkflow,
  getWorkflows,
  getWorkflowLogs,
} from "../controllers/workflowController.js";

const router = new Router();

router.post("/", createWorkflow);
router.get("/", getWorkflows);
router.get("/logs/:workflowId", getWorkflowLogs);

export default router;
