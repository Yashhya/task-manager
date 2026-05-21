const { body } = require("express-validator");

const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be 2-100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be 2-150 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Status must be todo, in-progress, or completed"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid Project ID"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

const taskUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be 2-150 characters"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Status must be todo, in-progress, or completed"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

module.exports = {
  signupValidation,
  loginValidation,
  projectValidation,
  taskValidation,
  taskUpdateValidation,
};
