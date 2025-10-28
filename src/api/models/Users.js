const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, ingresa un email válido']
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'librarian', 'reader'],
      default: 'reader'
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User
