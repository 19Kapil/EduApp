const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});



module.exports = db;












// const mysql = require('mysql2');
// require('dotenv').config();

// // Create a connection string using environment variables
// const connectionString = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`;

// // Create a MySQL connection using the URL
// const db = mysql.createConnection(connectionString);

// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Connected to the database');
// });

// // Export the connection for use in other parts of the app
// module.exports = db;
















