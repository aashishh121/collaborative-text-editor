const mongoose = require("mongoose")

const { Schema } = mongoose;

const docSchema = new Schema(
  {
    docId: { type: String, required: true },
    docData: { type: Object, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("documents", docSchema);
