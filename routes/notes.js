// IImporting files for routes to function properly. 
const express = require('express');
const notes = express.Router();
const fs = require("fs");
const { readAndAppend, readFromFile, writeToFile } = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");

// Get route for the info in db.json
notes.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting a new note
notes.post("/", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (req.body) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };
// Adds the new note to the database in db.json
    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting notes");
  }
});
// Delete function that will remove a note from the left side.
notes.delete("/:id", (req, res) => {
  const { id } = req.params;
  const note = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

  const indexOfNotes = note.findIndex(note => note.id === id);

  note.splice(indexOfNotes, 1);

  writeToFile("./db/db.json", note);
  return res.send();
})

module.exports = notes;
