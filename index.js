const express = require('express')
const morgan = require('morgan')

const app = express();
const PORT = 3001

//MIDDLEWARE
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body',  (req, res) => {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//URL to DB
const url = "x"
let phoneBook = [{ 
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
}]





app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server  running on port ${PORT}`)
})

//route handlers
app.get('/api/persons', (req, res) => {
    res.json(phoneBook)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${phoneBook.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
     
     const personID = Number(req.params.id) // get id from url
     const person = phoneBook.filter(person => person.id === personID) // get person by id from phonebook 
     if(person) {
        res.json( person) 
     }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
  const personID = Number(req.params.id);
  phoneBook= phoneBook.filter(person => person.id !== personID)
  res.status(204).end()

})

app.post('/api/persons', (req, res) => {
    
    const body = req.body
    const name = phoneBook.some(person => Object.values(person).includes(body.name))
    
    //The name or number is missing or The name already exists in the phonebook
    if(!body.name) {      
          return res.status(418).json({ 
          error: 'name missing' 
          })      
    }
    else if(!body.number) {
      return res.status(418).json({ 
        error: 'Number missing' 
        })    
    }
    else if(name) {
      return res.status(400).json({ 
        error: 'Name already exist in DB' 
        })    
    }

    const person = {
        id: Math.floor(Math.random() * 1000 + phoneBook.length),
        name: body.name,
        number : body.number,
        important: body.important || false,
        date: new Date(),
        
      }

    phoneBook.push(person)

    res.json(person)
})

//middleware after our routes, that is used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)