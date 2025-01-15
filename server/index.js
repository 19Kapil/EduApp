const fs = require('fs');
const path = require('path');
const { uploadFile } = require('./fileUpload');

// Directory containing the report files
const directoryPath = './reportimg';

// Start roll number from 101
let rollNumber = 111;

// Function to upload files from the directory
const uploadFiles = () => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading the directory:", err);
      return;
    }

    // Loop through each file and upload it with an incrementing roll number
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      uploadFile(rollNumber, filePath); // Upload file with current roll number
      rollNumber++; // Increment roll number for the next file
    });
  });
};
uploadFiles();
