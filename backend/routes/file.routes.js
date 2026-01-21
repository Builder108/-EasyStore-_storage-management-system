import express from "express";
import multer from "multer";
import { getStorageUsage } from "../controllers/file.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import {
  uploadFile,
  listFiles,
  deleteFile,
  downloadFile,
  renameFile,
} from "../controllers/file.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/usage", verifyAuth, getStorageUsage);
router.post("/upload", verifyAuth, upload.single("file"), uploadFile);
router.get("/", verifyAuth, listFiles);
router.delete("/", verifyAuth, deleteFile);
router.get("/download", verifyAuth, downloadFile);
router.put("/rename", verifyAuth, renameFile);
export default router;
