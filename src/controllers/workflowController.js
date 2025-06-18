import prisma from "../prisma/client.js";

export const createWorkflow = async (req, res) => {
  const userId = req?.userId;
  const { name, trigger, actions } = req?.body;

  try {
    const workflow = await prisma.workflow.create({
      data: {
        name,
        trigger,
        actions,
        userId,
      },
    });

    res.status(201).send({ workflow });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getWorkflows = async (req, res) => {
  const userId = req?.userId;

  try {
    const workflows = await prisma.workflow.findMany({ where: { userId } });

    res.status(200).send({ workflows });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getWorkflowLogs = async (req, res) => {
  const { workflowId } = req?.params;
  const { status, limit = 10, offset = 0 } = req?.query;

  try {
    const workflowLogs = await prisma.workflowLog.findMany({
      where: { workflowId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    const totalCount = await prisma.workflowLog.count({
      where: {
        workflowId,
        ...(status ? { status } : {}),
      },
    });

    res.status(200).send({ workflowLogs, totalCount });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getAllWorkflowLogs = async (req, res) => {
  const { status, limit = 10, offset = 0 } = req?.query;

  try {
    const workflowLogs = await prisma.workflowLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    const totalCount = await prisma.workflowLog.count({
      where: {
        ...(status ? { status } : {}),
      },
    });

    res.status(200).send({ workflowLogs, totalCount });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const deleteWorkflow = async (req, res) => {
  const { workflowId } = req?.params;
  const userId = req?.userId;

  try {
    await prisma.workflow.delete({ where: { id: workflowId, userId } });

    res
      .status(200)
      .send({ message: `Workflow with id ${workflowId} deleted successfully` });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
