const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const medicineRoutes = require("./routes/medicineRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockRoutes = require("./routes/stockRoutes");
const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());


// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "Pharmacy Management System API Running"
    });
});


// ===============================
// MEDICINE ROUTES
// ===============================
app.use("/api/medicines", medicineRoutes);


// ===============================
// SUPPLIER ROUTES
// ===============================
app.use("/api/suppliers", supplierRoutes);


// ===============================
// STOCK ROUTES
// ===============================
app.use("/api/stock", stockRoutes);


// ===============================
// AUTH ROUTES
// ===============================
app.use("/api/auth", authRoutes);


// ===============================
// SALES ROUTES
// ===============================
app.use("/api/sales", salesRoutes);


// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});