// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");                 // 1
const { Server } = require("socket.io");      // 2

const Document = require("./models/Document"); // 3

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// ----------- Connect to MongoDB ------------
mongoose
  .connect(MONGO_URI, { dbName: "realtime_docs_app" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ----------- Create HTTP Server ------------
const server = http.createServer(app);         // 4

// ----------- Setup Socket.io ---------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ------------- Socket Logic ----------------
io.on("connection", (socket) => {               // 5
  console.log("🟢 A user connected:", socket.id);

  // When user joins a document room
  socket.on("get-document", async (documentId) => {   // 6
    const doc = await findOrCreateDocument(documentId);

    socket.join(documentId);                      // 7
    socket.emit("load-document", doc.content);    // 8

    // When a user makes changes
    socket.on("send-changes", (delta) => {        // 9
      socket.to(documentId).emit("receive-changes", delta); // 10
    });

    // When user saves
    socket.on("save-document", async (data) => {  // 11
      await Document.findByIdAndUpdate(documentId, { content: data });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ----------- Helper Function --------------
async function findOrCreateDocument(id) {        // 12
  if (!id) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, content: { ops: [] } });
}

// ----------- Start Server -----------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
