const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const addChild = async (req, res) => {
  const userId = req.query.userid;
  const { childName, childRegNo, childClass } = req.body;

  if (!childName || !childRegNo || !childClass || typeof childClass !== "number") {
    return res.status(400).json({ message: "Invalid input" });
  }

  const tableName = `class${childClass}`;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [checkChild] = await connection.query(
      "SELECT * FROM ?? WHERE name = ? AND registration_number = ?",
      [  tableName ,childName, childRegNo]
    );

    if (checkChild.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Child not found in class table" });
    }

    await connection.query(
      "UPDATE users SET childregno = ?, childclass = ? WHERE userid = ?",
      [childRegNo, childClass, userId]
    );

    await connection.query(
      `UPDATE class${childClass} SET userid = ? WHERE registration_number = ?`,
      [ userId, childRegNo]
    );

    await connection.commit();
    res.status(200).json({ message: "Child successfully linked to user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error linking child to user", error });
  }
};


module.exports = { addChild };
