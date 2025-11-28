import express from "express";
import { addItem, toggleItem, deleteItem } from "../controllers/itemController.js";
import { requireProfile } from "../middleware/auth.js";

const router = express.Router();

// POST /item/:listId/add   → přidání položky
router.post("/:listId/add", requireProfile(), addItem);

// POST /item/:listId/toggle/:itemId   → přepnutí completed
router.post("/:listId/toggle/:itemId", requireProfile(), toggleItem);

// DELETE /item/:listId/delete/:itemId   → odstranění položky
router.delete("/:listId/delete/:itemId", requireProfile(), deleteItem);

export default router;