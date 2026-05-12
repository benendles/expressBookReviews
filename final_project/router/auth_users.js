const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// =======================
// USER STORAGE
// =======================
let users = [];

// =======================
// VALIDATION
// =======================
const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// =======================
// REGISTER
// =======================
regd_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.json({ message: "User registered successfully" });
});

// =======================
// LOGIN
// =======================
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { username },
        "fingerprint_customer",
        { expiresIn: "1h" }
    );

    return res.json({ message: "Login successful", token });
});

// =======================
// AUTH MIDDLEWARE
// =======================
const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "fingerprint_customer");
        req.user = decoded.username;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// =======================
// ADD / UPDATE REVIEW
// =======================
regd_users.put("/auth/review/:isbn", authenticate, (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// =======================
// DELETE REVIEW
// =======================
regd_users.delete("/auth/review/:isbn", authenticate, (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(400).json({ message: "No review found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;