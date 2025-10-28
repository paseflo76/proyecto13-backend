const { isAuth, isAdmin } = require('../../middlewares/auth')
const {
  getUsers,
  getMyProfile,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser
} = require('../controllers/Users')

const userRoutes = require('express').Router()

userRoutes.get('/validate', isAuth, (req, res) => {
  res.status(200).json({ message: 'Token válido', user: req.user })
})

userRoutes.get('/admin-only', isAuth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido administrador' })
})

userRoutes.get('/', isAuth, isAdmin, getUsers)
userRoutes.get('/me', isAuth, getMyProfile)
userRoutes.get('/:id', isAuth, getUserById)
userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.put('/:id', isAuth, updateUser)
userRoutes.delete('/:id', isAuth, deleteUser)

module.exports = userRoutes
