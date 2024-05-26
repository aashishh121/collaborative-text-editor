const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const connectdb = require("./src/config/db.config.js");
const Documnent = require("./src/models/doc-schema.js");

const PORT = 5000 ;

const app = express();
connectdb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = app.listen(PORT, () => {
  console.log("server is running on", PORT);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("get-documentbyid", async (docId) => {
    const getDocs = await findOrCreateDocById(docId);

    socket.join(docId);
    socket.emit("load-document", getDocs?.docData);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(docId).emit("recieve-changes", data);
    });

    socket.on("save-docschanges", async (data) => {
      await updateDocsById(docId, data);
    });
  });
});

async function updateDocsById(docId, data) {
  if (docId == null) return;

  await Documnent.updateOne(
    { docId: docId },
    {
      $set: {
        docData: data,
      },
    }
  ).exec();
}

async function findOrCreateDocById(docId) {
  if (docId == null) return;
  const docs = await Documnent.findOne({ docId: docId }).exec();
  if (docs) return docs;

  return await new Documnent({
    docId: docId,
    docData: "",
  }).save();
}
