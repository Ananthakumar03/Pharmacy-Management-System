# 💊 PharmaCare — Pharmacy Management System

A full-stack pharmacy management web application built with Node.js, Express, MySQL, and vanilla JavaScript. Designed to help pharmacies manage medicines, sales, staff accounts, and reporting from a single dashboard.

## ✨ Features

- **Authentication & Roles** — Secure login with bcrypt password hashing and JWT tokens. Supports Admin, Staff, and User roles.
- **Admin Approval System** — New account registrations require admin approval before login is allowed.
- **Dashboard** — Live overview of total medicines, total sales, and a monthly sales trend chart.
- **Medicine Management** — Role-based access to add, edit, and delete medicines (Admin only).
- **Sales & Billing** — Point-of-sale style billing with live medicine search.
- **Reports** — Export sales reports as PDF or Excel with a single click.
- **Staff Profile** — ID-badge style profile page with barcode and editable display name.
- **Responsive UI** — Built with Bootstrap 5 and custom styling.

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6), Chart.js, jsPDF, SheetJS
**Backend:** Node.js, Express.js
**Database:** MySQL
**Auth:** JWT, bcrypt

## 📁 Project Structure

```
Pharmacy-Management-System/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── middleware/       # Auth middleware (JWT verification, admin check)
│   ├── routes/           # API routes (auth, medicines, sales)
│   └── server.js
└── frontend/
    ├── index.html         # Login page
    ├── register.html      # Create account page
    ├── dashboard.html      # Main dashboard
    ├── medicines.html      # Medicine inventory
    ├── sales.html          # Billing / POS
    ├── profile.html        # Staff profile
    └── pending-approvals.html  # Admin approval queue
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL installed and running

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Ananthakumar03/Pharmacy-Management-System.git
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` folder with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=pharmacy_management
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server
   ```bash
   node server.js
   ```

5. Open `frontend/index.html` with Live Server (VS Code extension) or any static file server.

## 📌 Note

This project was built as a learning/college project. Contributions and suggestions are welcome.
