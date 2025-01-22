
const bcrypt = require("bcrypt");
const db = require("./db");

//for parent login 
const login = async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).send({ success: false, message: "Missing fields" });
  }

  try {
    const query = "SELECT * FROM users WHERE userid = ?";
    db.query(query, [userid], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).send({ success: false, message: err ? "Database error" : "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, result[0].password);
      if (isPasswordValid) {
        return res.status(200).send({ 
          success: true, 
          message: "Login successful", 
          user: result[0],
        });
      }

      return res.status(400).send({ success: false, message: "Invalid password" });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

  // Login  for Teachers
  const teacherlogin = (req, res, db) => {
    const { teacherCode } = req.body;
  
    const query = "SELECT * FROM teachers WHERE teacherCode = ?";
    db.query(query, [teacherCode], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ success: false, message: "Database error" });
      }
  
      if (results.length === 0) {
        return res.status(404).send({ success: false, message: "Teacher not found" });
      }
  
      const teacher = results[0];
      res.send({ success: true, teacherClass: teacher.teacherClass, teacherId: teacher.teacherId });
    });
  };
  
//for logout
  const logout=(req, res) => {

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Logout failed' });
      }
      res.status(200).send({ message: 'Logged out successfully' });
    });
  };

  
  

  module.exports = {login, teacherlogin , logout};
