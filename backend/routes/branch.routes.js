import { Router } from "express";
import {
  createData,
  deleteData,
  fetchData,
  updateData,
} from "../controller/controller.js";
import { Branch } from "../model/branch.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, Branch);
});

router.route("/").post((req, res) => {
  createData(req, res, Branch);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, Branch);
});

router.route("/:id").delete((req, res) => {
  deleteData(req, res, Branch);
});

export default router;
