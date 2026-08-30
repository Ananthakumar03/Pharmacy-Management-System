const express = require("express");
const router = express.Router();

const db = require("../config/db");

// ===============================
// GET ALL STOCK ENTRIES (with medicine & supplier name)
// ===============================
router.get("/", (req, res) => {

    const sql = `
        SELECT 
            stock.id,
            stock.quantity_added,
            stock.purchase_date,
            medicines.name AS medicine_name,
            suppliers.name AS supplier_name
        FROM stock
        JOIN medicines ON stock.medicine_id = medicines.id
        LEFT JOIN suppliers ON stock.supplier_id = suppliers.id
    `;

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
// ADD NEW STOCK ENTRY
// ===============================
router.post("/", (req, res) => {

    const {
        medicine_id,
        supplier_id,
        quantity_added,
        purchase_date
    } = req.body;

    const sql = `
        INSERT INTO stock
        (medicine_id, supplier_id, quantity_added, purchase_date)
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        medicine_id,
        supplier_id,
        quantity_added,
        purchase_date
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to add stock entry",
                error: err.message
            });
        }

        // Also update medicine's quantity
        const updateSql = `
            UPDATE medicines
            SET quantity = quantity + ?
            WHERE id = ?
        `;

        db.query(updateSql, [quantity_added, medicine_id], (updateErr) => {

            if (updateErr) {
                return res.status(500).json({
                    message: "Stock added but failed to update medicine quantity",
                    error: updateErr.message
                });
            }

            res.status(201).json({
                message: "Stock entry added successfully",
                stockId: result.insertId
            });
        });
    });

});


// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;