import { Router } from "express";
import { createData, fetchData, updateData } from "../controller/controller.js";
import { Branding } from "../model/branding.model.js";

const router = Router();

router.route("/").get((req, res) => {
  fetchData(req, res, Branding);
});

router.route("/").post((req, res) => {
  createData(req, res, Branding);
});

router.route("/:id").put((req, res) => {
  updateData(req, res, Branding);
});

export default router;
