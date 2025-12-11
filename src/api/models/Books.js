const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    covers: { type: String },
    available: { type: Boolean, default: true },
    category: {
      type: String,
      enum: [
        'fiction',
        'science',
        'history',
        'biography',
        'children',
        'fantasy',
        'mystery',
        'romance',
        'horror',
        'adventure',
        'selfHelp',
        'philosophy',
        'poetry',
        'travel',
        'cookbook',
        'art',
        'comic',
        'graphicNovel',
        'trueCcrime',
        'technology'
      ],
      required: true
    }
  },
  { timestamps: true, collection: 'books' }
)

const Book = mongoose.model('Book', BookSchema, 'books')

module.exports = Book
