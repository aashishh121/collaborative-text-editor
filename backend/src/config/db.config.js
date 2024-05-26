const mongoose = require("mongoose");


const url = "mongodb://localhost:27017/realtime-texteditor";
 async function connectdb() {
  try {
    await mongoose.connect(url);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error.message, "error");
  }
}

module.exports = connectdb
