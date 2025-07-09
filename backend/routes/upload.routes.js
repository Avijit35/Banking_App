import { Router } from "express";
import { uploadFile } from "../controller/upload.controller.js";
import { upload } from "../services/upload.service.js";

const router = Router();

router.route("/").post(upload.single("file"), uploadFile);

export default router;
