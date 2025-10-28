const Book = require('../models/Books')
const Loan = require('../models/Loans')

//* Crear préstamo
const postLoan = async (req, res) => {
  try {
    const { bookId } = req.body
    const userId = req.user._id

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' })
    if (!book.available)
      return res.status(400).json({ message: 'Libro no disponible' })

    const loanDate = new Date()
    const returnDate = new Date(loanDate)
    returnDate.setMonth(loanDate.getMonth() + 1) // un mes después

    const loan = await Loan.create({
      book: book._id,
      user: userId,
      loanDate,
      returnDate,
      status: 'ongoing'
    })

    book.available = false
    await book.save()

    res.status(201).json(loan)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//* Devolver libro
const patchLoan = async (req, res) => {
  try {
    const { id } = req.params
    const loan = await Loan.findById(id).populate('book')
    if (!loan)
      return res.status(404).json({ message: 'Préstamo no encontrado' })
    if (loan.status === 'returned')
      return res.status(400).json({ message: 'Libro ya devuelto' })

    loan.status = 'returned'
    loan.returnDate = new Date()
    await loan.save()

    const book = await Book.findById(loan.book._id)
    book.available = true
    await book.save()

    res.status(200).json({ message: 'Libro devuelto', loan })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//* Obtener todos los préstamos de un usuario
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id })
      .populate('book', 'title author covers')
      .populate('user', 'userName email')
      .sort({ loanDate: -1 })

    res.status(200).json(loans)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//* Obtener todos los préstamos (solo admin)
const getAllLoans = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Acceso restringido a administradores' })
    }

    const loans = await Loan.find()
      .populate('book', 'title author covers')
      .populate('user', 'userName email')
      .sort({ loanDate: -1 })

    res.status(200).json(loans)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { postLoan, patchLoan, getMyLoans, getAllLoans }
