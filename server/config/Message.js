// sendMessage function
const sendMessage = (req, res, db) => {
  const { senderid, receiverid } = req.params;
  const { message: content } = req.body;

  if (!content || !content.trim()) {
    return res
      .status(400)
      .send({ success: false, message: "Message cannot be empty" });
  }
  if (!senderid || !receiverid) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Sender and Receiver IDs are required",
      });
  }

  const query =
    "INSERT INTO messages (senderid, receiverid, message, date,is_read) VALUES (?, ?, ?, NOW(),FALSE)";
  db.query(query, [senderid, receiverid, content.trim()], (err) => {
    if (err) {
      console.error("Error sending message:", err);
      return res
        .status(500)
        .send({ success: false, message: "Database error" });
    }
    res.send({ success: true, message: "Message sent successfully!" });
  });
};

// getMessages function
const getMessages = (req, res, db) => {
  const { id1, id2 } = req.params;

  const query =
    "SELECT senderid, receiverid, message, date, is_read FROM messages WHERE (senderid = ? AND receiverid = ?) OR (senderid = ? AND receiverid = ?) ORDER BY date ASC";

  db.query(query, [id1, id2, id2, id1], (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res
        .status(500)
        .send({ success: false, message: "Database error" });
    }
    res.send({ success: true, messages: results });
  });
};

// getUnreadCount function
const getUnreadCount = (req, res, db) => {
  const { id1, id2 } = req.params;
  

  if (!id1 || !id2) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Teacher ID and Student ID are required",
      });
  }

  const query = `
    SELECT  COUNT(*) AS unread_count 
    FROM messages 
    WHERE senderid = ? AND receiverid = ?
      AND is_read = FALSE 
  `;

  db.query(query, [id1, id2], (err, results) => {
    if (err) {
      console.error("Error fetching unread count:", err);
      return res
        .status(500)
        .send({ success: false, message: "Database error" });
    }
    res.send({ success: true, unread_count: results[0].unread_count });
  });
};

// markMessagesAsRead function
const markMessagesAsRead = (req, res, db) => {
  const { id1, id2 } = req.params;

  if (!id1 || !id2) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Teacher ID and Student ID are required",
      });
  }

  const query = `
    UPDATE messages 
    SET is_read = TRUE 
    WHERE (senderid = ? AND receiverid = ?) OR (senderid = ? AND receiverid = ?)
  `;

  db.query(query, [id1, id2, id2, id1], (err) => {
    if (err) {
      console.error("Error marking messages as read:", err);
      return res
        .status(500)
        .send({ success: false, message: "Database error" });
    }
    res.send({ success: true, message: "Messages marked as read" });
  });
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  markMessagesAsRead,
};
