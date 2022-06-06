const express = require('express')
const app = express();

app.use(express.json())

const PORT = 3001


app.listen(PORT, ()=> {
    console.log(`Server  running on port ${PORT}`)
})

// hardcoded list of phonebook entries
let phoneBook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phoneBook)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${phoneBook.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
     
     const personID = Number(req.params.id) // get id from url
     const person = phoneBook.find(person => person.id === personID) // get person by id from phonebook 
     if(person) {
        res.json( person) 
     }
    else {
        res.status(404).end()
    }
})



app.post('/api/persons', (req, res) => {
    
    const body = req.body
    const name = phoneBook.some(person => Object.values(person).includes(body.name))
    console.log(body.name)
    console.log(name)
    //The name or number is missing or The name already exists in the phonebook
    if(!body.name) {      
          return res.status(400).json({ 
          error: 'name missing' 
          })      
    }
    else if(!body.number) {
      return res.status(400).json({ 
        error: 'Number missing' 
        })    
    }
    else if(name) {
      return res.status(400).json({ 
        error: 'name already exist in DB' 
        })    
    }

    const person = {
        id: Math.floor(Math.random() * 1000 + phoneBook.length),
        name: body.name,
        number : body.number,
        important: body.important || false,
        date: new Date(),
        
      }

    phoneBook = phoneBook.concat(person)

    res.json(person)
})