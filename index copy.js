require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.static('build'))

// cors middleware
app.use(cors())

// bodyParser middleware
app.use(bodyParser.json())

// Logger middleware when not a POST request
// Use default 'tiny' string format
app.use(morgan('tiny', { 
  skip: (req) => { return req.method == "POST" },
  stream: process.stdout 
}));

// Logger when it is a POST request
// Create new token
morgan.token('reqData', (req) => {
  return(JSON.stringify({ "name": req.body.name, "number": req.body.number}))
});

// set string format
var POSTLoggerFormat = ':method :url :status :res[content-length] - :response-time ms :reqData';

// log POST using string format and created token
app.use(morgan(POSTLoggerFormat, {
  skip: (req) => { return req.method != "POST" },
  stream: process.stdout 
}));


/*let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]*/

app.get('/', (req, res) =>{
  res.send(`<h1>DK Phonebook</h1>
  <p>Use:
  <ul>
  <li>./api/persons</li> 
  <li>./api/persons/#</li> 
  <li>./info</li> 
  </ul></p>`)
})

app.get('/info', (req, res) =>{
  res.send(
    `<p>The phonebook has info for ${persons.length} people</p>
    <p>${Date().toLocaleString()}</p>`)
}) 

app.get('/api/persons', (req, res) => {
  Person 
  .find({})
  .then(results => {
    res.json(results)
  }).catch(error => console.log(error.message))
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'content missing'
    })
  }

  /*//Check that the person is already in the list 
  const checkExists = Person.find(person => person.name.toLowerCase() === body.name.toLowerCase())
  console.log(checkExists)
  if (checkExists > 0) {
    console.log("error: name already exists")
    return res.status(409).json({
      error: 'name already exists'
    })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number 
  })
  console.log(`trying to add ${person}`)

  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
    res.json(person)
  })
})


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})