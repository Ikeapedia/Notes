const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uuid = require('./helper/uuid');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true }));

app.use(express.static('public'));

//GET / should return the html.index file
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html'))
);

//GET /notes should return notes.html file
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html"))
);


//Should read db.json file and return saved notes as JSON
app.get('/api/notes', (req, res) => {
        res.sendFile(path.join(__dirname, './db/db.json'));
    });

app.post('/api/notes', (req, res) => {
        let db = fs.readFileSync('./db/db.json');
        db = JSON.parse(db);
        res.json(db);

        let noteBody = {
            title: req.body.title,
            text: req.body.text,
            id: uuid()
        };

        //Created note pushed to the db.json file
        db.push(noteBody);
        fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(db), (error)=>{
            return (error ? console.log(error) : console.log("Your note was saved"))
        });
        res.json(db);

    });

    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });


    //Delete route for the application
    app.delete('/api/notes/:id', (req, res) => {
        let db = JSON.parse(fs.readFileSync('./db/db.json'));

        let deleteNote = db.filter(item => item.id !== req.params.id);

        fs.writeFileSync('./db/db.json', JSON.stringify(deleteNote));
        res.json(deleteNote);
    })