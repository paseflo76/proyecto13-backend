const jwt = require('jsonwebtoken')

// Centraliza la validación del secreto
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no definido')
  }
  return process.env.JWT_SECRET
}

//! Genera token JWT con id y rol
const generateSign = (id, role) => {
  if (!id || !role) {
    throw new Error('Faltan id o role para generar token')
  }

  const secret = getJwtSecret()

  return jwt.sign({ id, role }, secret, { expiresIn: '1y' })
}

//! Verifica token JWT
const verifyJwt = (token) => {
  if (!token) {
    throw new Error('Token no proporcionado')
  }

  const secret = getJwtSecret()

  return jwt.verify(token, secret)
}

module.exports = { generateSign, verifyJwt }
