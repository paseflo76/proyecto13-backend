const User = require('../api/models/Users')
const { verifyJwt } = require('../config/jwt')

//TODO:  Middleware de autenticación

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = verifyJwt(token)

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' })

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'No autorizado' })
  }
}
//TODO:  Middleware de autorización de administrador
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Acceso restringido a administradores' })
  }
  next()
}
//TODO:  Middleware de autorización de bibliotecario
const isLibrarian = (req, res, next) => {
  if (req.user?.role !== 'librarian') {
    return res.status(403).json({ message: 'Acceso solo para bibliotecarios' })
  }
  next()
}

module.exports = { isAuth, isAdmin, isLibrarian }
