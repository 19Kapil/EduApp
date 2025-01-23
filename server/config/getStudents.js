
const db = require("./db");

const getStudents = (req, res, db) => {
    const teacherClass = req.query.class;
  
    if (!teacherClass) {
      return res.status(400).json({ error: "Class parameter is required" });
    }
    const query = `SELECT * FROM class${teacherClass}`;
    db.query(query, [teacherClass], (err, results) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }
  
      res.json(results);
    });
  };


  const getTeachers = (req, res, db) => {
    const childclass = req.query.class;
   
  
    if (!childclass) {
      return res.status(400).json({ error: "Class parameter is required" });
    }
    const query = `SELECT teacherName, teacherId FROM teachers WHERE teacherClass = ?`;
    db.query(query, [childclass], (err, results) => {
      if (err) {
        console.error("Error fetching teachers:", err);
        return res.status(500).json({ error: "Failed to fetch teachers" });
      }
  
      res.json(results);
    });
  };




  const getReport = (req, res, db) => {
    const teacherClass = req.query.class;
    const studentRollNo = req.query.roll_number;
  
    // Validate inputs
    if (!teacherClass || !studentRollNo) {
      console.log(teacherClass, studentRollNo);
      return res.status(400).json({ error: "Missing required parameters" });
    }
  
    // SQL query to fetch the report
    const query = `SELECT report FROM class${teacherClass} WHERE roll_number = ?`;
  
    db.query(query, [studentRollNo], (err, results) => {
      if (err) {
        console.error("Error fetching report card:", err);
        return res.status(500).json({ error: "Failed to fetch report card" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Report card not found for the given roll number" });
      }
  
      // Convert the BLOB report image to a Base64 string
      let reportBase64 = null;
      if (results[0].report) {
        reportBase64 = Buffer.from(results[0].report).toString("base64");
      }
  
      // Send the report as a Base64-encoded string
      res.json({
        roll_no: studentRollNo,
        report: reportBase64,
      });
    });
  };
  
  
  

  module.exports = { getStudents, getReport, getTeachers}; 