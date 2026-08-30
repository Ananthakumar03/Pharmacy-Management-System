const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ===============================
// GET ALL MEDICINES
// (எல்லாரும் பார்க்கலாம் - Admin & Staff இருவருக்கும்)
// ===============================
router.get("/", (req, res) => {

    const sql = "SELECT * FROM medicines";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(200).json(results);
    });

});


// ===============================
// ADD NEW MEDICINE
// (Admin மட்டும் - verifyToken + isAdmin middleware)
// ===============================
router.post("/", verifyToken, isAdmin, (req, res) => {

    const {
        name,
        category,
        manufacturer,
        batch_number,
        quantity,
        price,
        expiry_date
    } = req.body;

    const sql = `
        INSERT INTO medicines
        (name, category, manufacturer, batch_number, quantity, price, expiry_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        category,
        manufacturer,
        batch_number,
        quantity,
        price,
        expiry_date
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to add medicine",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Medicine added successfully",
            medicineId: result.insertId
        });
    });

});


// ===============================
// UPDATE MEDICINE
// (Admin மட்டும் - verifyToken + isAdmin middleware)
// ===============================
router.put("/:id", verifyToken, isAdmin, (req, res) => {

    const { id } = req.params;

    const {
        name,
        category,
        manufacturer,
        batch_number,
        quantity,
        price,
        expiry_date
    } = req.body;

    const sql = `
        UPDATE medicines
        SET name = ?,
            category = ?,
            manufacturer = ?,
            batch_number = ?,
            quantity = ?,
            price = ?,
            expiry_date = ?
        WHERE id = ?
    `;

    const values = [
        name,
        category,
        manufacturer,
        batch_number,
        quantity,
        price,
        expiry_date,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to update medicine",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Medicine updated successfully"
        });
    });

});


// ===============================
// DELETE MEDICINE
// (Admin மட்டும் - verifyToken + isAdmin middleware)
// ===============================
router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM medicines WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to delete medicine",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            message: "Medicine deleted successfully"
        });
    });

});


// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;