import { Router } from "express";
import { findByAccountNo } from "../controller/controller.js";
import { Customer } from "../model/customers.model.js";

const router = Router();

router.route("/").post((req, res) => {
  findByAccountNo(req, res, Customer);
});

export default router;
