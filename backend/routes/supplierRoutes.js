const express = require("express");
const router = express.Router();

const db = require("../config/db");

// ===============================
// GET ALL SUPPLIERS
// ===============================
router.get("/", (req, res) => {

    const sql = "SELECT * FROM suppliers";

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
// ADD NEW SUPPLIER
// ===============================
router.post("/", (req, res) => {

    const {
        name,
        phone,
        email,
        address
    } = req.body;

    const sql = `
        INSERT INTO suppliers
        (name, phone, email, address)
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        name,
        phone,
        email,
        address
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to add supplier",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Supplier added successfully",
            supplierId: result.insertId
        });
    });

});


// ===============================
// UPDATE SUPPLIER
// ===============================
router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        phone,
        email,
        address
    } = req.body;

    const sql = `
        UPDATE suppliers
        SET name = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?
    `;

    const values = [
        name,
        phone,
        email,
        address,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to update supplier",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Supplier updated successfully"
        });
    });

});


// ===============================
// DELETE SUPPLIER
// ===============================
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM suppliers WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to delete supplier",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            message: "Supplier deleted successfully"
        });
    });

});


// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;