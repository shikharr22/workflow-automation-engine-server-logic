import axios from "axios";

import nodemailer from "nodemailer";

import prisma from "../prisma/client.js";

export const actionRunner = async (action, workflowId) => {
  try {
    switch (action?.type) {
      case "email":
        return await handleEmail(action, workflowId);
      case "teams":
        return await handleTeams(action, workflowId);
      case "webhook":
        return await handleWebhook(action, workflowId);
      default:
        return { success: false, message: "Unsupported action type" };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error while running action:${action?.type}`,
      error,
    };
  }
};

const handleWebhook = async (action, workflowId) => {
  try {
    const response = await axios.post(action.url, action.payload || {});
    await workflowLogAction({
      workflowId,
      actionType: "webhook",
      status: "success",
      message: response.status,
    });
    return { success: true, status: response.status };
  } catch (error) {
    console.error("Webhook failed:", error.message);
    await workflowLogAction({
      workflowId,
      actionType: "webhook",
      status: "failed",
      message: error.message,
    });
    return { success: false, message: error.message };
  }
};

const handleEmail = async (action, workflowId) => {
  try {
    // Create test transporter (mock)
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email", // test mail
      port: 587,
      auth: {
        user: "testuser@example.com", // dummy, replace if needed
        pass: "testpass",
      },
    });

    const info = await transporter.sendMail({
      from: '"Workflow Engine" <no-reply@workflow.com>',
      to: action.to,
      subject: action.subject,
      text: action.body,
    });

    await workflowLogAction({
      workflowId,
      actionType: "email",
      status: "success",
      message: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email failed:", error.message);
    await workflowLogAction({
      workflowId,
      actionType: "email",
      status: "failed",
      message: error.message,
    });
    return { success: false, message: error.message };
  }
};

const handleTeams = async (action, workflowId) => {
  try {
    const response = await axios.post(action.webhookUrl, {
      text: action.message,
    });
    await workflowLogAction({
      workflowId,
      actionType: "teams",
      status: "success",
      message: response.status,
    });
    return { success: true, status: response.status };
  } catch (error) {
    console.error("Teams webhook failed:", error.message);
    await workflowLogAction({
      workflowId,
      actionType: "teams",
      status: "failed",
      message: error.message,
    });
    return { success: false, message: error.message };
  }
};

const workflowLogAction = async ({
  workflowId,
  actionType,
  status,
  message,
}) => {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    await prisma.workflowLog.create({
      data: {
        workflowName: workflow?.name,
        workflowId,
        actionType,
        status,
        message,
      },
    });
  } catch (error) {
    console.log("Failed to log workflow", error);
  }
};
