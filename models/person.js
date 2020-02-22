// Database connect stuffs
const mongoose = require('mongoose')
const password = "tHFxfeEdSVzuA28r"
const url = `mongodb+srv://FSO_part3:${password}@cluster0-qca5l.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String   // Use string instead of number so that leading zeros are retained.
})