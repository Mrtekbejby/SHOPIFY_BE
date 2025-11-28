import express from "express";
import {
  createList,
  getAllLists,
  getListById,
  updateList,
  archiveList,
  deleteList,
  addMember,
  removeMember,
  leaveList,
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

// DELETE /list/delete/:id
router.delete("/delete/:id", requireProfile(), deleteList);


// POST /list/:id/add-member
router.post("/:id/add-member", requireProfile(), addMember);

// DELETE /list/:id/remove-member/:memberId
router.delete("/:id/remove-member/:memberId", requireProfile(), removeMember);

// POST /list/:id/leave
router.post("/:id/leave", requireProfile(), leaveList);


export default router;