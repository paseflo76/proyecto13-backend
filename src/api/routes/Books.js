const { isAuth } = require('../../middlewares/auth')
const upload = require('../../middlewares/file')

const {
  getBooksByCategory,
  getBooksById,
  postBook,
  putBook,
  deleteBook,
  getBooks,
  getCategories
} = require('../controllers/Books')

const BookRouter = require('express').Router()

BookRouter.get('/', getBooks)

BookRouter.get('/categories', getCategories)

BookRouter.get('/category/:category', getBooksByCategory)

BookRouter.get('/:id', getBooksById)

BookRouter.post('/', isAuth, upload.single('covers'), postBook)

BookRouter.put('/:id', isAuth, upload.single('covers'), putBook)

BookRouter.delete('/:id', isAuth, deleteBook)

module.exports = BookRouter
