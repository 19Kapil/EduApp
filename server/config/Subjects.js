 
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

const getchapters = (req, res, db) => {
    const {subjectToFetch} = req.params;

    const query = `
        SELECT c.id, c.chapter_name, c.status 
        FROM chapters c
        WHERE c.subject_id = ?;
    `;

    db.query(query, [subjectToFetch], (err, results) => {
      if (err) {
        console.error("Error fetching chapters: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json(results); 
    });
}

const updateStatus = (req, res, db) => {
    const {id} = req.params;
    const {status} = req.body;
    const query = "UPDATE chapters SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, results) => {
      if (err) {
        console.error("Error updating chapter status: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ message: "Chapter status updated successfully" });
    });
  };

module.exports = { getSubjects, getchapters, updateStatus };