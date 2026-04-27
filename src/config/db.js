const mongoose = require('mongoose')

//TODO: Conectar a la base de datos

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    console.log('conectado con la BBDD 👍🚀')
  } catch (error) {
    console.error('ERROR CONECTANDO BBDD:', error.message)
    console.error('STACK:', error.stack)

    process.exit(1)
  }
}

module.exports = { connectDB }
