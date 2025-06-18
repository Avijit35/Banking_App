import { findOneRecord } from "../services/db.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const LoginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = { email };

    const dbRes = await findOneRecord(query, schema);

    if (!dbRes) {
      return res.status(401).json({
        message: "Invalid Credentials !",
        isLogged: false,
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, dbRes.password);

    if (!isCorrectPassword) {
      return res.status(401).json({
        message: "Invalid Credentials !",
        isLogged: false,
      });
    }

    if (!dbRes.isActive) {
      return res.status(401).json({
        message: "You are not active member !",
        isLogged: false,
      });
    }
    delete dbRes._doc.password;
    const payload = {
      ...dbRes._doc,
      _id: dbRes._id.toString(),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return res.status(200).json({
      message: "Data found !",
      isLogged: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      isLogged: false,
      error,
    });
  }
};

export { LoginFunc };
