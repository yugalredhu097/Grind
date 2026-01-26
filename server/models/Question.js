const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: String,
  year: Number,
  topic: String,
  questionText: String,
  options: [String],
  correctAnswer: Number,
  ntaSolution: String
});

module.exports = mongoose.model("Question", questionSchema);
