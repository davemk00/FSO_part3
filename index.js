const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))

// cors middleware
app.use(cors())

// bodyParser middleware
app.use(bodyParser.json())


app.get('/', (req, res) =>{
  res.send(`<h1>DK Phonebook</h1>
  <p>Use:
  <ul>
  <li>./api/persons</li> 
  <li>./api/persons/#</li> 
  <li>./info</li> 
  </ul></p>`)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})