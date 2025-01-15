const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const updateAttendance = async (req, res) => {
  const { teacherClass, attendance, attendance_date } = req.body;

  if (!attendance || !attendance_date || !teacherClass) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Query to check if attendance already exists for the given date
  const checkQuery = `
    SELECT * FROM attendance WHERE attendance_date = ? AND class = ?
  `;

  // Query to update attendance data
  const updateQuery = `
    UPDATE attendance
    SET status = ?, name = ?
    WHERE registration_number = ? AND attendance_date = ? AND class = ?
  `;

  // Query to insert new attendance data
  const insertQuery = `
    INSERT INTO attendance (class, registration_number, status, attendance_date, name)
    VALUES (?, ?, ?, ?, ?)
  `;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if attendance already exists for the given class and date
    const [existingAttendance] = await connection.query(checkQuery, [attendance_date, teacherClass]);

    // Loop through each student's attendance
    for (const registration_number in attendance) {
      const status = attendance[registration_number];

      // Retrieve the student's name based on registration number
      const [studentData] = await connection.query(
        `SELECT name FROM class${teacherClass} WHERE registration_number = ?`,
        [registration_number]
      );


      const studentName = studentData[0].name;

      if (existingAttendance.length > 0) {
        // If attendance for this class and date already exists, update it
        await connection.query(updateQuery, [status, studentName, registration_number, attendance_date, teacherClass]);
      } else {
        // If attendance does not exist for this class and date, insert new data
        await connection.query(insertQuery, [teacherClass, registration_number, status, attendance_date, studentName]);
      }
    }

    await connection.commit();
    res.status(200).json({ message: "Attendance updated successfully!" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to update attendance.", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};


const getAttendance = async (req, res) => {
  const { registration_number } = req.params;

  if (!registration_number) {    
    return res.status(400).json({ message: "Missing required fields." });

  }

  try {
    const [result] = await pool.execute(`SELECT attendance_date, status FROM attendance WHERE registration_number = ?
    ORDER BY attendance_date DESC`, [registration_number]);
    res.json(result);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error querying the database" });
  }
};

module.exports = { updateAttendance, getAttendance };
