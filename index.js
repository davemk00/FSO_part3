const express = require('express')
const app = express()
require('dotenv').config();
const bodyParser = require('body-parser')

const Person = require('./models/person')

// bodyParser middleware
app.use(bodyParser.json())

// cors middleware
const cors = require('cors')
app.use(cors())

// requestLogger Middleware
const morgan = require('morgan')

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


app.use(express.static('build'))

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
    `<p>The phonebook has info for ${Person.length} people</p>
    <p>${Date().toLocaleString()}</p>`)
}) 

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    console.log("content missing")
    return res.status(400).json({ 
      error: 'content missing'
    })
  }

  // //Check that the person is already in the list 
  // const checkExists = Person.find(person => person.name.toLowerCase() === body.name.toLowerCase())
  // console.log(checkExists)
  // if (checkExists > 0) {
  //   console.log("error: name already exists")
  //   return res.status(409).json({
  //     error: 'name already exists'
  //   })
  // }


  const person = new Person({
    name: body.name,
    number: body.number,
    id: getRandomInt(10000),
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})


app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person =>{
      console.log(person);
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    }) 
    .catch(error => {
      next(error)
    })    
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}







// handler of requests with unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error Handler Middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: 'input error'});
  }
  next(error);
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})