const mongoose = require('mongoose')

async function connectToDB() {
  const URL = process.env.DB_CONNECTION_STRING
  // const URL = 'mongodb://localhost:27017/mega'
  try {
    await mongoose.connect(URL)
    console.log("DB is connected")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectToDB