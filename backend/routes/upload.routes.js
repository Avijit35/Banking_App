import { Router } from "express";
import { uploadFile } from "../controller/upload.controller.js";

const router = Router();

router.route("/").post(uploadFile);

export default router;
