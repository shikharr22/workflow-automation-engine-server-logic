import { Router } from "express";
import {
  createWorkflow,
  getWorkflows,
  getWorkflowLogs,
  getAllWorkflowLogs,
  deleteWorkflow,
} from "../controllers/workflowController.js";

const router = new Router();

router.post("/", createWorkflow);
router.get("/", getWorkflows);
router.delete("/:workflowId", deleteWorkflow);
router.get("/logs/all", getAllWorkflowLogs);
router.get("/logs/:workflowId", getWorkflowLogs);

export default router;
