import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import {
  createGem,
  updateGem,
  getGems,
  deleteGem,
} from "../controllers/gemController.js";

const router = express.Router();
router.get("/", getGems);
router.post("/", verifyToken, isAdmin, upload.array("images", 5), createGem);
router.put("/:id", verifyToken, isAdmin, upload.array("images", 5), updateGem);
router.delete("/:id", verifyToken, isAdmin, deleteGem);

export default router;