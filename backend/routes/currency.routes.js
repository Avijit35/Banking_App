import { Router } from "express";
import {
  createData,
  deleteData,
  fetchData,
  updateData,
} from "../controller/controller.js";
import { Currency } from "../model/currency.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, Currency);
});

router.route("/").post((req, res) => {
  createData(req, res, Currency);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, Currency);
});

router.route("/:id").delete((req, res) => {
  deleteData(req, res, Currency);
});

export default router;
