import { Router } from "express";
import { createData } from "../controller/controller.js";
import { User } from "../model/users.model.js";

const router = Router();

router.route("/").post((req, res) => {
  createData(req, res, User);
});

export default router;
