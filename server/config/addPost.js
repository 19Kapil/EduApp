const { v4: uuidv4 } = require('uuid');
const path = require('path');

const addPost = async (req, res, db) => {
  const { description } = req.body;
  const image = req.file; 
  

  if (!image || !description) {
    return res.status(400).send({ success: false, message: 'Missing fields' });
  }

  const imageBuffer = image.buffer; // This is the image binary data (Buffer)
  
  const newPost = {
    id: uuidv4(),
    image: imageBuffer,
    description,
    date: new Date()

  };

  const query = 'INSERT INTO posts (id, image, description, date) VALUES (?, ?, ?, ?)';
  db.query(query, [newPost.id, newPost.image, newPost.description, newPost.date], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ success: false, message: 'Database error' });
    }

    res.send({ success: true, message: 'Post added successfully!' });
  });
};

module.exports = { addPost };
