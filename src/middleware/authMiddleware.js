import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Not authorised" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt?.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded?.id;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export default authMiddleware;
