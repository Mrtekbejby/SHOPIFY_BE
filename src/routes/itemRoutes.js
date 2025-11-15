import express from "express";
import {
  addItem,
  listItems,
  markItemCompleted,
  markItemUncompleted,
  removeItem
} from "../controllers/itemController.js";
import { requireProfile } from "../middleware/auth.js";

const router = express.Router();

// POST /item/add
router.post("/add", requireProfile(), addItem);

// GET /item/list/:listId
router.get("/list/:listId", requireProfile(), listItems);

// POST /item/markCompleted/:id
router.post("/markCompleted/:id", requireProfile(), markItemCompleted);

// POST /item/markUncompleted/:id
router.post("/markUncompleted/:id", requireProfile(), markItemUncompleted);

// DELETE /item/remove/:id
router.delete("/remove/:id", requireProfile(), removeItem);

export default router;