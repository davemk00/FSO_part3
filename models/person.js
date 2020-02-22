const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
  .then(result =>{
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

module.exports = mongoose.model('Person', {
  name: String,
  number: String   // Use string instead of number so that leading zeros are retained.
})