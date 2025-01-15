  const db = require("./db");

  const loadPost = (req, res, db) => {
  const query = "SELECT id, image, description, date FROM posts ORDER BY date DESC";
  db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({ error: "Failed to fetch posts" });
      }
    results = results.map((post) => {
        if (post.image) {
          // Convert BLOB to Base64 string
          post.image = Buffer.from(post.image).toString("base64");
        }
        return post;
      });
  
      res.json(results);
    });
  };

 const delPost = (req, res) => {
    const postId = req.params.id;
  
    // SQL query to delete the post
    const query = 'DELETE FROM posts WHERE id = ?';
  
    db.execute(query, [postId], (err, result) => {
      if (err) {
        console.error('Error deleting post: ', err);
        return res.status(500).send('Error deleting post');
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Post not found');
      }
  
      res.status(200).send('Post deleted successfully');
    });
  };
  






 module.exports = { loadPost , delPost }; 
