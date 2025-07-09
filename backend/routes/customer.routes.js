import { Router } from "express";
import {
  createData,
  deleteData,
  fetchData,
  updateData,
} from "../controller/controller.js";
import { Customer } from "../model/customers.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, Customer);
});

router.route("/").post((req, res) => {
  createData(req, res, Customer);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, Customer);
});

router.route("/:id").delete((req, res) => {
  deleteData(req, res, Customer);
});

export default router;
