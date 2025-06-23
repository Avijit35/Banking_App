import { Router } from "express";
import { verifyToken } from "../services/token.service.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const verified = await verifyToken(req, res);
  if (verified.isVerified) {
    return res.status(200).json({
      message: "Token verified !",
      data: verified.data,
      isVerified: true,
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized user!",
      isVerified: false,
    });
  }
});

export default router;
