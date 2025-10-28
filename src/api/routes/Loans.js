const express = require('express')
const { isAuth, isAdmin } = require('../../middlewares/auth')
const {
  postLoan,
  patchLoan,
  getMyLoans,
  getAllLoans
} = require('../controllers/Loans')

const loanRouter = express.Router()

loanRouter.patch('/:id/return', isAuth, patchLoan)
loanRouter.post('/', isAuth, postLoan)
loanRouter.get('/myloans', isAuth, getMyLoans)
loanRouter.get('/all', isAuth, isAdmin, getAllLoans)

module.exports = loanRouter
