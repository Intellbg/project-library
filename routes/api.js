/*
*
*
*       Complete the API routing below
*       
*       
*/
'use strict';
const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      const books = await Book.find()
      return res.json(books)
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.json("missing required field title")
      }
      let commentcount = 0
      try {
        const book = new Book({ title, commentcount })
        await book.save();
        return res.json(book);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    })

    .delete(async function (req, res) {
      const result = Book.deleteMany({});
      return res.json("complete delete successful");
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let book_id = req.params.id;
      try {
        let book = await Book.findOne({ "_id": book_id });
        if (!book) {
          return res.json('no book exists');
        }
        return res.json(book);
      } catch (error) {
        return res.json('no book exists');
      }
    })

    .post(async function (req, res) {
      let book_id = req.params.id;
      let comment = req.body.comment;
      console.log(book_id)
      console.log(comment)
      if (!comment) {
        return res.json('missing required field comment');
      }
      try {
        let r = await Book.updateOne(
          { _id: book_id },
          {
            $push: { comments: comment },
            $inc: { commentcount: 1 }
          }
        )
        if(r['modifiedCount']==0){
          throw new error("not updated")
        }
        return res.json(await Book.findOne({ "_id": book_id }));
      } catch (error) {
        return res.json('no book exists');
      }
    })

    .delete(async function (req, res) {
      let book_id = req.params.id;
      const book = await Book.findByIdAndDelete({ "_id": book_id });
      if (!book) {
        return res.json('no book exists');
      }
      return res.json('delete successful');
    });

};
