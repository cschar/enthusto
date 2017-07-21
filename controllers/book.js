/**
 * GET /books
 * List all books.
 */
const Book = require('../models/Book.js');

exports.getBooks = (req, res) => {
  Book.find({}).sort('-createdAt').exec((err, docs) => {
  	

    res.render('books', { books: docs });
  });
};

/**
 * GET /books/:ID
 * Get detail.
 */
exports.getBooksDetail = (req, res) => {
	console.log(req.params.Id)

  Book.findOne({_id: req.params.Id}, (err, book) => {
    res.render('booksDetail', {'book': book });
  });
};

exports.createBooks = (req, res) => {

	var aBook = new Book( {name: req.body.name} )
	aBook.save()
	res.redirect('back');

  // Book.find((err, docs) => {
  //   res.render('books', { books: docs.sort({createdAt: -1}) });
  // });
};
