const fs = require('fs');
const path = require('path');
const db = require('./config/db'); // Import the db connection

// Function to upload a single file to the database
const uploadFile = (rollNumber,filePath) => {
  try {
    const fileData = fs.readFileSync(filePath); // Read file as binary data

    // SQL query to insert the file into the database
    const query = "UPDATE class8 SET report = ? WHERE roll_number = ?";


    db.query(query, [fileData ,rollNumber], (err, results) => {
      if (err) {
        console.error(`Error uploading file for roll number ${rollNumber}:`, err);
      } else {
        console.log(`File uploaded successfully for Roll Number: ${rollNumber}`);
      }
    });
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

module.exports = { uploadFile };
