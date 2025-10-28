const { deleteFile } = require('../../utils/deletefile')
const Book = require('../models/Books')

//TODO:  Obtener todos los libros
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
    return res.status(200).json(books)
  } catch (error) {
    return res.status(500).json('Error al obtener los libros')
  }
}

//TODO:  Obtener un libro por ID
const getBooksById = async (req, res, next) => {
  try {
    const { id } = req.params
    const book = await Book.findById(id)
    return res.status(200).json(book)
  } catch (error) {
    return res.status(500).json('Error al obtener el libro por ID')
  }
}

//TODO:  Obtener libros por categoría
const getBooksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const books = await Book.find({ category })
    return res.status(200).json(books)
  } catch (error) {
    return res.status(500).json('Error al obtener libros por categoría')
  }
}
//TODO:  Obtener todas las categorías de libros
const getCategories = (req, res) => {
  try {
    console.log('Book:', Book)
    const categoryPath = Book.schema.path('category')
    console.log('categoryPath:', categoryPath)
    const categories = categoryPath ? categoryPath.enumValues : []
    return res.status(200).json(categories)
  } catch (err) {
    console.error(err)
    return res.status(500).json('Error al obtener categorías')
  }
}
//TODO:  Crear un nuevo libro
const postBook = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({
        message:
          'No tienes permiso para crear libros solo los admin y librarian'
      })
    }

    console.log('req.body:', req.body)
    console.log('req.file:', req.file)

    const newBook = new Book({
      ...req.body,
      covers: req.file ? req.file.path : undefined
    })

    const bookSaved = await newBook.save()
    return res.status(201).json(bookSaved)
  } catch (error) {
    console.error('Error en postBook:', error)
    return res.status(500).json({ message: 'Error al crear el libro', error })
  }
}
//TODO:  Actualizar un libro
const putBook = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({
        message:
          'No tienes permiso para modificar libros solo los admin y librarian'
      })
    }

    const { id } = req.params
    const existingBook = await Book.findById(id)
    if (!existingBook) {
      return res
        .status(404)
        .json({ message: 'Libro no encontrado para actualizar' })
    }

    // si viene archivo, sustituir imagen
    let updatedData = { ...req.body }
    if (req.file) {
      if (existingBook.covers) deleteFile(existingBook.covers)
      updatedData.covers = req.file.path
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true
    })
    return res
      .status(200)
      .json({ message: 'Libro editado correctamente', updatedBook })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el libro',
      error: error.message
    })
  }
}
//TODO:  Eliminar un libro
const deleteBook = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({
        message:
          'No tienes permiso para eliminar libros solo los admin y librarian'
      })
    }

    const { id } = req.params
    const bookDeleted = await Book.findByIdAndDelete(id)
    if (!bookDeleted) {
      return res
        .status(404)
        .json({ message: 'Libro no encontrado para eliminar' })
    }

    // borrar portada de Cloudinary si existe
    if (bookDeleted.covers) {
      deleteFile(bookDeleted.covers)
    }

    return res.status(200).json({
      message: 'Libro eliminado correctamente',
      book: bookDeleted
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el libro',
      error: error.message
    })
  }
}

module.exports = {
  getBooks,
  getBooksById,
  getBooksByCategory,
  getCategories,
  postBook,
  putBook,
  deleteBook
}
