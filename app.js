const Express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const Note = require('./model/noteModel');


const app = Express();
const PORT = 5000;

app.use(morgan('dev'));

mongoose.connect('mongodb+srv://mswaran348:jPw1TbMxKpi6AfyT@cluster0.wafsw3s.mongodb.net/noteapp')
.then(() => console.log("Connected to database"))
.catch(err => console.error("Could not connect to MongoDB", err));


app.use(cors()); // enable CORS

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

// HTTP Methods
// GET
// POST
// PUT
// PATCH
// DELETE


// Create a API 

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(note => {
            if (!note) {
                return res.status(404).send("Note not found.");
            }
            res.json(note);
        })
        .catch(err => res.status(500).json(err));
});

app.route('/api/notes') // /api/notes
    .get((req, res) => {
        Note.find()
            .then(notes => res.json(notes))
            .catch(err => res.status(500).json(err));
    })
    .post((req, res) => {
        if (!req.body) {
            return res.status(400).json({
                status: 'error',
                error: 'Request body cannot be empty',
            });
        }
        
        Note.create(req.body)
            .then(note => res.status(201).json(note))
            .catch(err => res.status(500).json(err));
    });

    app.route('/api/notes/:id')
    .patch((req, res) => {
        const { id } = req.params;
        const update = req.body;

        Note.findByIdAndUpdate(id, update, { new: true })
            .then(updatedNote => {
                if (!updatedNote) {
                    return res.status(404).send("Note not found.");
                }
                res.json(updatedNote);
            })
            .catch(err => res.status(500).json(err));
    })
    .delete((req, res) => {
        const { id } = req.params;

        Note.findByIdAndDelete(id)
            .then(result => {
                if (!result) {
                    return res.status(404).send("Note not found.");
                }
                res.send("Note deleted successfully.");
            })
            .catch(err => res.status(500).json(err));
    });

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
