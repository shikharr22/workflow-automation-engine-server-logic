import jwt from "jsonwebtoken";

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_TOKEN, { expiresIn: "24hr" });
}

export default generateToken;
