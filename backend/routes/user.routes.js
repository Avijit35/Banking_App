import { Router } from "express";
import {
  createData,
  deleteData,
  fetchData,
  updateData,
} from "../controller/controller.js";
import { User } from "../model/users.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, User);
});

router.route("/").post((req, res) => {
  createData(req, res, User);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, User);
});

router.route("/:id").delete((req, res) => {
  deleteData(req, res, User);
});

export default router;
