// sendMessage function
const sendMessage = (req, res, db) => {
  const { senderid, receiverid } = req.params;
  const { message: content } = req.body;

  // Check if content exists and is not empty
  if (!content || !content.trim()) {
    return res.status(400).send({ success: false, message: "Message cannot be empty" });
  }

  // Check if sender and receiver IDs are provided
  if (!senderid || !receiverid ) {
    return res.status(400).send({ success: false, message: "Sender and Receiver IDs are required" });
  }

  // Insert message into database
  const query = "INSERT INTO messages (senderid, receiverid, message, date) VALUES (?, ?, ?, NOW())";
  db.query(query, [senderid, receiverid, content.trim()], (err) => {
    if (err) {
      console.error("Error sending message:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }
    res.send({ success: true, message: "Message sent successfully!" });
  });
};

// getMessages function
const getMessages = (req, res, db) => {
  const { id1, id2 } = req.params;

  const query = "SELECT senderid, receiverid, message, date FROM messages WHERE (senderid = ? AND receiverid = ?) OR (senderid = ? AND receiverid = ?) ORDER BY date ASC";
  
  db.query(query, [id1, id2, id2, id1], (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }
    res.send({ success: true, messages: results });
  });
};

module.exports = { sendMessage, getMessages };
