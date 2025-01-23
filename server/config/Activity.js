const db = require("./db");

const getActivity = async (req, res) => {
    const {teacherClass} = req.params;

    
    const query = 'SELECT * FROM activities WHERE Class = ?';
  
    
    db.query(query, [teacherClass], (err, results) => {
      if (err) {
        console.error('Error fetching activities:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results); 
    });
  };
  
  
  
  const updateActivity = (req, res) => {
    const { id } = req.params; 
    const { Status, first_place, second_place, third_place } = req.body;

   
    const query = `
      UPDATE activities
      SET Status = ?, first_place = ?, second_place = ?, third_place = ?
      WHERE ActivityID = ?
    `;

    db.query(
      query,
      [Status, first_place, second_place, third_place, id], 
      (err, results) => {
        if (err) {
          console.error('Error updating activity:', err);
          return res.status(500).json({ error: 'Database update failed' });
        }

        
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Activity not found' });
        }

        res.json({ message: 'Activity updated successfully' });
      }
    );
};

  
  
  module.exports = { updateActivity, getActivity };
  