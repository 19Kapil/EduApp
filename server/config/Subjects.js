 
const getSubjects = (req, res, db) => {
    const {classToFetch} = req.params;
    const query = "SELECT subject_name,id FROM subjects WHERE class = ?";
    db.query(query, [classToFetch], (err, results) => {
      if (err) {
        console.error("Error fetching subjects: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json(results); 
    });
}

module.exports = { getSubjects };