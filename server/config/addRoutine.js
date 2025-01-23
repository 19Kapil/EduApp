const path = require("path");

const addRoutine = (req, res, db) => {
  const { file: image } = req; 
  const { teacherClass } = req.query; 

  if (!image || !teacherClass)
    return res
      .status(400)
      .send({ success: false, message: "Missing image or teacherClass" });

  db.query(
    "UPDATE teachers SET routine = ? WHERE teacherClass = ?",
    [image.buffer, teacherClass],
    (err) =>
      err
        ? res.status(500).send({ success: false, message: "Database error" })
        : res.send({ success: true, message: "Routine added successfully!" })
  );
};

const loadRoutine = (req, res, db) => {
  const { teacherClass } = req.query;

  const query = "SELECT routine FROM teachers WHERE teacherClass = ?";
  db.query(query, [teacherClass], (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Failed to fetch routine" });
    }

    // Convert the BLOB (routine) to Base64 string for each post
    results = results.map((post) => {
      if (post.routine) {
        // Convert BLOB to Base64 string
        post.routine = post.routine.toString("base64");
      }
      return post;
    });

    res.json(results);
  });
};

module.exports = { addRoutine, loadRoutine };
