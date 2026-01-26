const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET questions (with filters)
router.get("/", async (req, res) => {
  try {
    const { subject, year } = req.query;

    let filter = {};
    if (subject) filter.subject = subject;
    if (year) filter.year = year;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

module.exports = router;

