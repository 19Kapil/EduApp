const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// API 1: Get child registration number by userId
const getChildRegistrationNumber = async (req, res) => {
    const { userid } = req.query;
    if (!userid) return res.status(400).json({ message: "User ID is required" });

    try {
        const [result] = await pool.execute("SELECT childregno, childclass FROM users WHERE userid = ?", [userid]);
        if (result.length) {
            return res.json(result[0]);
        }
        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error querying the database" });
    }
};

// API 2: Get child details by registration number (regNo) and class
const getChildDetails = async (req, res) => {
    const { registration_number: childregno, class: childclass } = req.query;
    if (!childregno || !childclass) return res.status(400).json({ message: "Both registration number and class are required" });

    try {
        const [result] = await pool.execute(`SELECT * FROM class${childclass} WHERE registration_number=?`, [childregno]);
        if (result.length) {
            return res.json(result[0]);
        }
        return res.status(404).json({ message: "Child details not found" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error querying the database" });
    }
};

module.exports = { getChildRegistrationNumber, getChildDetails };
