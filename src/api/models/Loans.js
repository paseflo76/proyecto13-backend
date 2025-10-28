const mongoose = require('mongoose')

const LoanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanDate: { type: Date, default: Date.now },
  returnDate: {
    type: Date,
    validate: {
      validator: function (v) {
        return !v || v >= this.loanDate
      },
      message: 'La fecha de devolución debe ser posterior al préstamo'
    }
  },
  status: { type: String, enum: ['ongoing', 'returned'], default: 'ongoing' }
})

const Loan = mongoose.model('Loan', LoanSchema, 'loans')
module.exports = Loan
