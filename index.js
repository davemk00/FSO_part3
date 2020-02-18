const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
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
]

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
  res.json(persons)
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

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)

  const person = {
    name: body.name,
    number: body.number || false,
    id: getRandomInt(10000),
  }

  persons = persons.concat(person)
  res.json(body)
})


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}