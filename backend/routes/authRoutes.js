const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const JWT_SECRET = "pharmacy_secret_key_123";

// ===============================
// REGISTER NEW USER
// ===============================
router.post("/register", async (req, res) => {

    const { username, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (username, email, password, role, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            username,
            email,
            hashedPassword,
            role || "staff",
            "pending"
        ];

        db.query(sql, values, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to register user",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Account created! Please wait for admin approval before logging in.",
                userId: result.insertId
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }

});


// ===============================
// LOGIN USER
// ===============================
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // 🔒 Block login if account is still pending admin approval
        if (user.status === "pending") {
            return res.status(403).json({
                message: "Your account is waiting for admin approval. Please try again later."
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });

});
// ===============================
// UPDATE USERNAME (Edit Profile Name)
// ===============================
router.put("/update-name", (req, res) => {

    const { id, username } = req.body;

    if (!id || !username) {
        return res.status(400).json({
            message: "User id and new name are required"
        });
    }

    const sql = "UPDATE users SET username = ? WHERE id = ?";

    db.query(sql, [username, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to update name",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Name updated successfully",
            username: username
        });
    });

});

// ===============================
// GET PENDING USERS (Admin only)
// ===============================
router.get("/pending-users", (req, res) => {

    const sql = "SELECT id, username, email, role, created_at FROM users WHERE status = 'pending'";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch pending users",
                error: err.message
            });
        }

        res.status(200).json(results);
    });

});

// ===============================
// APPROVE USER (Admin only)
// ===============================
router.put("/approve-user/:id", (req, res) => {

    const { id } = req.params;

    const sql = "UPDATE users SET status = 'approved' WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to approve user",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User approved successfully"
        });
    });

});

// ===============================
// REJECT USER (Admin only) - deletes the pending account
// ===============================
router.delete("/reject-user/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id = ? AND status = 'pending'";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to reject user",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Pending user not found"
            });
        }

        res.status(200).json({
            message: "User rejected and removed"
        });
    });

});

// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;