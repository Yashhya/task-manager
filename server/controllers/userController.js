const User = require("../models/User");

/**
 * @desc    Get all users (for assigning to projects/tasks)
 * @route   GET /api/users
 * @access  Private
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt").sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("GetUsers Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getUsers };
