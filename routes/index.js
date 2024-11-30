const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const users = []; // In-memory user storage

// Middleware for authenticated routes
function checkAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/");
}

// Middleware for admin access
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.redirect("/landing");
}

// Home Route
router.get("/", (req, res) => {
  res.render("home");
});

// Register Route
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.render("register", { error: "User already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword, role: "user" });
  res.redirect("/login");
});

// Login Route
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", { error: "Invalid credentials." });
  }
  req.session.user = user;
  res.redirect("/landing");
});

// Landing Route
router.get("/landing", checkAuthenticated, (req, res) => {
  if (req.session.user.role === "admin") {
    res.render("landing", { user: req.session.user, users });
  } else {
    res.render("landing", { user: req.session.user, users: null });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
