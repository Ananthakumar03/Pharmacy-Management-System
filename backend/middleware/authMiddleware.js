const jwt = require("jsonwebtoken");

const JWT_SECRET = "pharmacy_secret_key_123"; // authRoutes.js-ல் இருக்குற அதே secret key

// ===============================
// Token-ஐ verify பண்ணி, req.user-ல் id & role-ஐ வைக்கிறோம்
// ===============================
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Header format: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token expired or invalid" });
        }
        req.user = decoded; // { id, role }
        next();
    });
}

// ===============================
// Admin மட்டும் அணுக அனுமதிக்கும் middleware
// ===============================
function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
}

module.exports = { verifyToken, isAdmin };