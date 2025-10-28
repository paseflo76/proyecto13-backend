const mongoose = require('mongoose')

//TODO: Conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('conectado con la BBDD👍🚀')
  } catch (error) {
    console.log('error conectando con la BBDD')
  }
}

module.exports = { connectDB }
