import prisma from "../prisma/client.js";
import { actionRunner } from "../utils/actionRunner.js";

export const triggerWorkflow = async (req, res) => {
  const userId = req?.userId;
  const { workflowId } = req?.params;

  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow?.userId !== userId) {
      return res.status(400).send({ message: "Workflow not found" });
    }

    const actions = workflow?.actions;
    let actionsResult = {};
    for (let action of actions) {
      const result = await actionRunner(action, workflow?.id);
      actionsResult[action?.type] = result;
    }

    res.status(200).send({
      message: "Workflow triggered",
      name: workflow?.name,
      result: actionsResult,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
