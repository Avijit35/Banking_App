import { Router } from "express";
import { createData, fetchData } from "../controller/controller.js";
import { User } from "../model/users.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, User);
});

router.route("/").post((req, res) => {
  createData(req, res, User);
});

export default router;
