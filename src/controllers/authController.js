import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { email, password } = req?.body;

  try {
    const ifUserExists = await prisma.user.findUnique({
      where: { email },
    });

    if (ifUserExists) {
      /**user already exists */
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    const token = generateToken(user?.id);

    res.status(201).send({ user: { id: user?.id, email: user?.email }, token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const login = async (req, res) => {
  const { email, password } = req?.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const passwordMatch = bcrypt.compareSync(password, user?.password);

    if (!passwordMatch) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = generateToken(user?.id);

    res.status(201).send({ user: { id: user?.id, email: user?.email }, token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
