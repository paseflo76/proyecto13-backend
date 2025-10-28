require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { connectDB } = require('../../config/db')
const Book = require('../../api/models/Books')
const { csvAll, validateRequiredFields } = require('./csvreusable/csvall')

//TODO:  Script para poblar la colección de libros desde un CSV

async function seedBooks() {
  try {
    await connectDB()

    const csvPath = path.join(__dirname, 'data', 'book.csv')
    if (!fs.existsSync(csvPath))
      throw new Error('Archivo book.csv no encontrado')

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const books = csvAll(csvContent)

    const requiredFields = ['title', 'author', 'isbn', 'category']
    const validBooks = books.filter((book) =>
      validateRequiredFields(book, requiredFields)
    )

    await Book.deleteMany({})
    await Book.insertMany(validBooks)

    console.log(`Seed completado: ${validBooks.length} libros insertados.`)
  } catch (error) {
    console.error('Error en seedBooks:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

if (require.main === module) seedBooks()
module.exports = { seedBooks }
