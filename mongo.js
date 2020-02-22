const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://FSO_part3:${password}@cluster0-qca5l.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })


const Person = mongoose.model('Person', {
  name: String,
  number: String   // Use string instead of number so that leading zeros are retained.
})


if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

if ( process.argv.length === 3 ) {

  console.log("phonebook:")
  Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(error => console.log(error.message))
  
} 

else if ( process.argv.length === 5 ) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    console.log(`added ${response.name} number ${response.number} to phonebook`)
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}