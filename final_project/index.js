const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// SESSION (keep but NOT used for auth anymore)
app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// =========================
// JWT AUTH MIDDLEWARE (FIXED)
// =========================
app.use("/customer/auth", function (req, res, next) {

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
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));