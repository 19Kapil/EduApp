const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const addChild = async (req, res) => {
    const userId = req.query.userid;
    const { childName, childRegNo, childClass } = req.body;  // Required fields
  
    if (!childName || !childRegNo || !childClass) {
      return res.status(400).json({ message: 'All fields are required' });

    }
  
  
    try {
      // Ensure childClass is a valid string
      if (typeof childClass !== 'number') {
        return res.status(400).json({ message: 'Invalid class string' });
      }
  
      // Dynamically handle table name using `class${childClass}`
      const tableName = `class${childClass}`;
  
      // Check if a child with the given class, name, and registration number exists
      const [checkChild] = await pool.query(
        'SELECT * FROM ?? WHERE name = ? AND registration_number = ?',
        [tableName, childName, childRegNo]
      );
  
      if (checkChild.length > 0) {
        // If exists, update the user's `childregno`
        const [result] = await pool.query(
          'UPDATE users SET childregno = ?, childclass = ? WHERE userid = ?',
          [childRegNo, childClass, userId],
        );
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Child with this name, registration number, and class does not exist' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating child', error });
    }
  };
  

module.exports = { addChild };
