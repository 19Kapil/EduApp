const db = require("./db");
// Fetch all activities for a specific class
const getActivity = async (req, res) => {
    const {teacherClass} = req.params;
    
    // SQL query to filter activities by class
    const query = 'SELECT * FROM activities WHERE Class = ?';
  
    // Query the database with teacherClass as the parameter
    db.query(query, [teacherClass], (err, results) => {
      if (err) {
        console.error('Error fetching activities:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results); // Send the fetched results as the response
    });
  };
  
  
  // Update an activity's details
  const updateActivity = (req, res) => {
    const { id } = req.params; // Retrieve activity ID from request parameters
    const { Status, first_place, second_place, third_place } = req.body; // Retrieve updated data from request body

    // SQL query to update activity in the database
    const query = `
      UPDATE activities
      SET Status = ?, first_place = ?, second_place = ?, third_place = ?
      WHERE ActivityID = ?
    `;

    db.query(
      query,
      [Status, first_place, second_place, third_place, id], // Corrected query with parameters
      (err, results) => {
        if (err) {
          console.error('Error updating activity:', err);
          return res.status(500).json({ error: 'Database update failed' });
        }

        // Check if any rows were updated
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Activity not found' });
        }

        res.json({ message: 'Activity updated successfully' });
      }
    );
};

  
  
  module.exports = { updateActivity, getActivity };
  