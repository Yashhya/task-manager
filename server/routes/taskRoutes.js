const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const { taskValidation, taskUpdateValidation } = require("../middleware/validators");

router.use(verifyToken); // All task routes require authentication

router.get("/stats", getTaskStats); // Must be before /:id
router.get("/", getTasks);
router.post("/", authorizeRoles("admin"), taskValidation, createTask);
router.put("/:id", taskUpdateValidation, updateTask);
router.delete("/:id", authorizeRoles("admin"), deleteTask);

module.exports = router;
