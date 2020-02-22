const mongoose = require('mongoose');
require('dotenv').config();
const url = "mongodb+srv://FSO_part3:tHFxfeEdSVzuA28r@cluster0-qca5l.mongodb.net/phonebook?retryWrites=true&w=majority";

console.log('connecting to', url)
console.log(process.env.PORT)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {    
    console.log('connected to MongoDB')  
  })  
  .catch((error) => {    
    console.log('error connecting to MongoDB:', error.message)  
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)