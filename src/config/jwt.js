const jwt = require('jsonwebtoken')

//! Genera token JWT con id y rol
const generateSign = (id, rol) => {
  if (!id || !rol) throw new Error('Faltan id o rol para generar token')
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1y' })
}

//! Verifica token JWT
const verifyJwt = (token) => {
  if (!token) throw new Error('Token no proporcionado')
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateSign, verifyJwt }
