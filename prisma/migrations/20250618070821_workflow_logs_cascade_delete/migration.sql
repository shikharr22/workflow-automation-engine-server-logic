-- DropForeignKey
ALTER TABLE "WorkflowLog" DROP CONSTRAINT "WorkflowLog_workflowId_fkey";

-- AddForeignKey
ALTER TABLE "WorkflowLog" ADD CONSTRAINT "WorkflowLog_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
