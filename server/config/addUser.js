const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const addUser = async (req, res, db) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).send({ success: false, message: "Missing fields" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const Id = uuidv4();

    const query =
      "INSERT INTO users (id, password, userid, created_at) VALUES (?, ?, ?, NOW())";
    db.query(query, [Id, hashedPassword, userid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .send({ success: false, message: "Database error" });
      }
      res.send({ success: true, message: "User successfully added!" });
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

module.exports = { addUser };
