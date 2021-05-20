// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs')
const uniqid = require('uniqid');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

//read in notes file
let notes = fs.readFileSync(path.join(__dirname, './db/db.json'))  // TO DO this is JSON

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes

// Basic route that sends the user first to the index Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes',(req,res) => res.sendFile(path.join(__dirname, './db/db.json')))

//Post routes
app.post('/api/notes',(req,res) => {
  //parse the notes into array
  const notesArray = JSON.parse(notes)
  
  //push the note into the array
  newNote = {id:uniqid(), title:req.body.title, text: req.body.text }
  console.log(newNote)
  notesArray.push(newNote)
  
  //re-save new array of notes
  notes = JSON.stringify(notesArray)
  fs.writeFileSync(path.join(__dirname, './db/db.json'),notes) //write updated notesArray to db.json

  //result
  res.status(200)
})

app.delete('/api/notes/:id',(req,res) => {
  //parse the notes into array
  const id = (req.params.id)
  const notesArray = JSON.parse(notes)
  const newNotesArray = notesArray.filter(obj => obj.id!==id)
  
  //re-save new array of notes
  notes = JSON.stringify(newNotesArray)
  fs.writeFileSync(path.join(__dirname, './db/db.json'),notes) //write updated notesArray to db.json

  res.status(200)
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
