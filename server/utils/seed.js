require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@taskmanager.com",
      password: "admin123",
      role: "admin",
    });

    const member1 = await User.create({
      name: "Sarah Johnson",
      email: "sarah@taskmanager.com",
      password: "member123",
      role: "member",
    });

    const member2 = await User.create({
      name: "Mike Chen",
      email: "mike@taskmanager.com",
      password: "member123",
      role: "member",
    });

    const member3 = await User.create({
      name: "Emily Davis",
      email: "emily@taskmanager.com",
      password: "member123",
      role: "member",
    });

    console.log("👥 Created users");

    // Create projects
    const project1 = await Project.create({
      title: "E-Commerce Platform",
      description: "Building a full-stack e-commerce platform with payment integration and order management.",
      createdBy: admin._id,
      members: [admin._id, member1._id, member2._id],
      color: "#6366f1",
    });

    const project2 = await Project.create({
      title: "Mobile App Redesign",
      description: "Complete UI/UX overhaul of the company mobile application for iOS and Android.",
      createdBy: admin._id,
      members: [admin._id, member2._id, member3._id],
      color: "#8b5cf6",
    });

    const project3 = await Project.create({
      title: "API Documentation",
      description: "Writing comprehensive API documentation with examples and interactive playground.",
      createdBy: admin._id,
      members: [admin._id, member1._id],
      color: "#06b6d4",
    });

    console.log("📂 Created projects");

    // Create tasks
    const today = new Date();
    const tasks = [
      // Project 1 tasks
      {
        title: "Set up project repository",
        description: "Initialize Git repo, configure CI/CD pipeline, set up branch protection rules.",
        status: "completed",
        priority: "high",
        assignedTo: member1._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Design database schema",
        description: "Create ER diagrams and define MongoDB collections for products, orders, users.",
        status: "completed",
        priority: "high",
        assignedTo: member2._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Implement user authentication",
        description: "JWT-based auth with signup, login, password reset, and OAuth integration.",
        status: "in-progress",
        priority: "high",
        assignedTo: member1._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Build product catalog API",
        description: "RESTful API endpoints for CRUD operations on products with pagination and filtering.",
        status: "in-progress",
        priority: "medium",
        assignedTo: member2._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Integrate payment gateway",
        description: "Stripe payment integration with support for cards, wallets, and subscriptions.",
        status: "todo",
        priority: "high",
        assignedTo: member1._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Shopping cart functionality",
        description: "Add to cart, update quantities, apply coupons, and persistent cart for logged-in users.",
        status: "todo",
        priority: "medium",
        assignedTo: member2._id,
        projectId: project1._id,
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      // Project 2 tasks
      {
        title: "Conduct user research",
        description: "Interview 20+ users, analyze pain points, and create user persona documents.",
        status: "completed",
        priority: "high",
        assignedTo: member3._id,
        projectId: project2._id,
        dueDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Create wireframes",
        description: "Low-fidelity wireframes for all major screens using Figma.",
        status: "in-progress",
        priority: "high",
        assignedTo: member3._id,
        projectId: project2._id,
        dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Design system components",
        description: "Build reusable component library with typography, colors, buttons, and form elements.",
        status: "todo",
        priority: "medium",
        assignedTo: member2._id,
        projectId: project2._id,
        dueDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Prototype animations",
        description: "Create micro-interaction prototypes and transition animations for key user flows.",
        status: "todo",
        priority: "low",
        assignedTo: member3._id,
        projectId: project2._id,
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      // Project 3 tasks
      {
        title: "Audit existing APIs",
        description: "Document all current API endpoints, request/response formats, and auth requirements.",
        status: "in-progress",
        priority: "high",
        assignedTo: member1._id,
        projectId: project3._id,
        dueDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Overdue!
        createdBy: admin._id,
      },
      {
        title: "Write API reference docs",
        description: "Comprehensive reference documentation with code examples in multiple languages.",
        status: "todo",
        priority: "medium",
        assignedTo: member1._id,
        projectId: project3._id,
        dueDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log("✅ Created tasks");

    console.log("\n========================================");
    console.log("🎉 Seed data created successfully!");
    console.log("========================================");
    console.log("\n📧 Admin Login:");
    console.log("   Email: admin@taskmanager.com");
    console.log("   Password: admin123");
    console.log("\n📧 Member Logins:");
    console.log("   Email: sarah@taskmanager.com | Password: member123");
    console.log("   Email: mike@taskmanager.com  | Password: member123");
    console.log("   Email: emily@taskmanager.com | Password: member123");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedData();
