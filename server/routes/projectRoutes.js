const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const { projectValidation } = require("../middleware/validators");

router.use(verifyToken); // All project routes require authentication

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", authorizeRoles("admin"), projectValidation, createProject);
router.put("/:id", authorizeRoles("admin"), projectValidation, updateProject);
router.delete("/:id", authorizeRoles("admin"), deleteProject);

module.exports = router;
