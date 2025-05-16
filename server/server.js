const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./db");
const User = require("./models/User");
const Skill = require("./models/Skill");
const Project = require("./models/Project");

// Load environment variables
dotenv.config();

// INITIALIZE EXPRESS FIRST
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to generate a hashed password - uncomment to create a new hash
async function generateHash() {
  const password = "password123";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("GENERATED HASH for password123:", hash);
  return hash;
}

// Uncomment this line to generate a new hash, then copy it to the users array
/* generateHash(); */

// In a real app, you would use a database. This is just for demonstration.
const users = [
  {
    id: 1,
    username: "admin",
    // Store the hashed password instead of plaintext
    // This is a valid bcrypt hash for "password123"
    password: "$2b$10$lCLY3L5c5Vss6qCT7WR4WOkipV7Dz3Wm4LKKiLIZrBWhaObX7/qUW",
  },
];

// Debug endpoint to check what's being received
app.post("/api/debug", (req, res) => {
  console.log("DEBUG REQUEST BODY:", req.body);
  res.json({ received: req.body });
});

// Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("--- LOGIN ATTEMPT ---");
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      console.log(`User not found: "${username}"`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log(`User found: ${user.username}`);

    // Use the comparePassword method from our model
    const isMatch = await user.comparePassword(password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log("Password mismatch!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Authentication successful");
    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      password, // Will be hashed by pre-save hook
      role: role || "user",
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Validate token
app.get("/api/auth/validate", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    console.log("Token validated successfully:", decoded);
    return res.json({ valid: true, user });
  } catch (err) {
    console.log("Token validation failed:", err.message);
    return res.status(401).json({ valid: false });
  }
});

// Protected route example
app.get("/api/admin/dashboard", authenticateToken, (req, res) => {
  // Only allow admin users
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden - Admin access required" });
  }

  res.json({ message: "Protected admin data", user: req.user });
});

// List all users (admin only)
app.get("/api/users", authenticateToken, async (req, res) => {
  // Only allow admin users
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden - Admin access required" });
  }

  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to authenticate token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user exists in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// Route to add a new skill
app.post("/api/skills", authenticateToken, async (req, res) => {
  const { name, level, type } = req.body;

  try {
    const skill = new Skill({
      name,
      level,
      type,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    console.error("Error adding skill:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to update a skill
app.put("/api/skills/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, level, type } = req.body;

  try {
    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, level, type },
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json(skill);
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to delete a skill
app.delete("/api/skills/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch all skills
app.get("/api/skills", authenticateToken, async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to add a new project
app.post("/api/projects", authenticateToken, async (req, res) => {
  const {
    title,
    company_name,
    description,
    technologies,
    start_date,
    end_date,
    is_current,
    is_featured,
  } = req.body;
  try {
    const project = new Project({
      title,
      company_name,
      description,
      technologies,
      start_date,
      end_date,
      is_current,
      is_featured,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to update a project
app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    companyName,
    description,
    technologies,
    startDate,
    endDate,
    isCurrent,
    featured,
  } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      {
        title,
        company_name: companyName,
        description,
        technologies,
        start_date: startDate,
        end_date: endDate,
        is_current: isCurrent,
        is_featured: featured,
      },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to delete a project
app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to fetch all projects
app.get("/api/projects", authenticateToken, async (req, res) => {
  try {
    // Get all projects
    const projects = await Project.find();

    // Use the method to format each project with populated skills
    const formattedProjects = await Promise.all(
      projects.map(async (project) => {
        return await project.getFormattedProjectWithSkills();
      })
    );

    res.json(formattedProjects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to list all available endpoints
app.get("/", (req, res) => {
  res.json({
    message: "Authentication API",
    endpoints: [
      {
        path: "/api/auth/login",
        method: "POST",
        description: "Log in with username and password",
      },
      {
        path: "/api/auth/register",
        method: "POST",
        description: "Register a new user",
      },
      {
        path: "/api/auth/validate",
        method: "GET",
        description: "Validate authentication token",
      },
      {
        path: "/api/admin/dashboard",
        method: "GET",
        description: "Protected admin route example",
      },
      {
        path: "/api/users",
        method: "GET",
        description: "List all users (admin only)",
      },
      {
        path: "/api/debug",
        method: "POST",
        description: "Debug endpoint to check request body",
      },
    ],
  });
});

app.post("/api/init", async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      return res.json({ message: "Admin user already exists" });
    }

    const admin = new User({
      username: "admin",
      password: "password123",
      role: "admin",
    });

    await admin.save();
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start the server AFTER successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test the API at http://localhost:${PORT}`);
      console.log(`To initialize admin user, send POST request to /api/init`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
