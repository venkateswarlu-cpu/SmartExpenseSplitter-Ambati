import express from "express";
import {
  getGroups,
  createGroup,
  getGroupById,
} from "../controllers/groupController.js";

const router = express.Router();

// GET all groups
router.get("/", getGroups);

// POST create new group
router.post("/", createGroup);

// GET specific group by ID
router.get("/:id", getGroupById);

export default router;
