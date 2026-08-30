const db = require("../config/db");

const getMedicines = (req, res) => {
    const sql = "SELECT * FROM medicines";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(200).json(results);
    });
};

// Add Medicine
const addMedicine = (req, res) => {

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
};

module.exports = {
    getMedicines,
    addMedicine
};