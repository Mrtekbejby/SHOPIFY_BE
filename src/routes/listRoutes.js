import express from "express";
import {
  createList,
  getAllLists,
  getListById,
  archiveList,
  deleteList,
  updateList,
  addMember,
  removeMember,
  leaveList
} from "../controllers/listController.js";
import { requireProfile } from "../middleware/auth.js";

const router = express.Router();


 // GET /list/get
router.get("/get", requireProfile(), getAllLists);

// GET /list/get/:id
router.get("/get/:id", requireProfile(), getListById);

// POST /list/create
router.post("/create", requireProfile(), createList);

// POST /list/update/:id
router.post("/update/:id", requireProfile(), updateList);

// POST /list/archive/:id
router.post("/archive/:id", requireProfile(), archiveList);

// POST /list/addMember/:id
router.post("/addMember/:id", requireProfile(), addMember);

// POST /list/removeMember/:id
router.post("/removeMember/:id", requireProfile(), removeMember);

// POST /list/leave/:id
router.post("/leave/:id", requireProfile(), leaveList);

// DELETE /list/delete/:id
router.delete("/delete/:id", requireProfile(), deleteList);

export default router;