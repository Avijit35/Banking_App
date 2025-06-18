import { Router } from "express";
import { LoginFunc } from "../controller/login.controller.js";
import { User } from "../model/users.model.js";

const router = Router();

router.route("/").post((req, res) => {
  LoginFunc(req, res, User);
});

export default router;
