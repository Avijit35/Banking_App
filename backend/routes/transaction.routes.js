import { Router } from "express";
import {
  createData,
  deleteData,
  fetchData,
  getTransactionSummary,
  updateData,
} from "../controller/controller.js";
import { Transaction } from "../model/transaction.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, Transaction);
});

router.route("/summary").get((req, res) => {
  getTransactionSummary(req, res, Transaction);
});

router.route("/").post((req, res) => {
  createData(req, res, Transaction);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, Transaction);
});

router.route("/:id").delete((req, res) => {
  deleteData(req, res, Transaction);
});

export default router;
