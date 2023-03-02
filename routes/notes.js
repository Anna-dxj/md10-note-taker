const notesRouter = require('express').Router()
const fs = require('fs')
const path = require('path')
const {v4: uuidv4} = require('uuid')

notesRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','db/db.json'))
    console.info(`${req.method} request received for notes`)
})

notesRouter.post('/', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }
        fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(readErr)
            } else {
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(newNote); 
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => {
                    (writeErr) => writeErr ? console.error(writeErr) : console.info('Succesfully updated Notes!')
                });
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response)
        res.status(201).json(response)
    } else {
        res.status(500).json('Error in posting note')
    }
})

notesRouter.delete('/:id', (req, res) => {
    fs.readFile(path.join(__dirname,'..','db/db.json'), 'utf8', (readErr, data) => {
        if (readErr){
            console.error(readErr)
        } else {
            const deleteNoted = req.params.id; 
            const parsedNotes = JSON.parse(data);
            const filteredNotes = parsedNotes.filter((note) => note.id !== deleteNoted)
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (writeErr) => {
                writeErr ? console.error(writeErr) : console.log ('Succesfuly deleted note!')
            })
            res.sendFile(path.join(__dirname,'..','db/db.json'))
        }
    })
})

module.exports = notesRouter