const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ===============================
// GET ALL SALES
// ===============================
router.get("/", (req, res) => {
    const sql = "SELECT * FROM sales ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.status(200).json(results);
    });
});

// ===============================
// CREATE NEW SALE (WITH AUTO STOCK REDUCTION)
// ===============================
router.post("/", (req, res) => {
    const { items } = req.body; // items array format: [{ medicine_id, quantity, price }]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items provided in sale" });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // 1. Insert into sales table
    const saleSql = "INSERT INTO sales (total_amount) VALUES (?)";
    db.query(saleSql, [totalAmount], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to create sale", error: err.message });
        }

        const saleId = result.insertId;

        // 2. Prepare sale items values
        const saleItemsValues = items.map(item => [saleId, item.medicine_id, item.quantity, item.price]);
        const itemsSql = "INSERT INTO sale_items (sale_id, medicine_id, quantity, price) VALUES ?";

        db.query(itemsSql, [saleItemsValues], (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to save sale items", error: err.message });
            }

            // 3. Update (Reduce) stock in medicines table for each item sold
            items.forEach(item => {
                const updateStockSql = "UPDATE medicines SET quantity = quantity - ? WHERE id = ?";
                db.query(updateStockSql, [item.quantity, item.medicine_id]);
            });

            res.status(201).json({
                message: "Sale completed and stock updated successfully",
                saleId: saleId,
                totalAmount: totalAmount
            });
        });
    });
});

module.exports = router;