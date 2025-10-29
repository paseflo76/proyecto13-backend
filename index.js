require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path') // <--- añadida
const { connectDB } = require('./src/config/db')
const BookRouter = require('./src/api/routes/Books')
const userRoutes = require('./src/api/routes/Users')
const loanRouter = require('./src/api/routes/Loans')

//TODO:  Servidor principal de la aplicación

const app = express()

app.use(cors())

/* app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})) */

app.use(express.json())

connectDB()

app.use('/api/v1/books', BookRouter)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/loans', loanRouter)

app.use(express.static(path.join(__dirname, 'build')))

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use((req, res) => {
  res.status(404).json('route not found')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`servidor levantado en: http://localhost:${PORT} 🚀🚀`)
})
