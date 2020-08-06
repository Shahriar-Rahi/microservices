//importing express and creating an instance of it

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

//connecting to the db
const mongoose = require("mongoose");

//
require("./Book");
const Book = mongoose.model("Book");

mongoose.connect("mongodb://testdb:testdb12@ds263368.mlab.com:63368/micro-books", ()=>{
    console.log("DB connected!");
})


//creating routes
app.get('/', (req, res) =>{
    res.send("This is our main endpoint!");
});


//creating functionality

app.post("/book", (req, res) =>{
    var newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher

    }

    //creating a new book
    var book = new Book(newBook);

    //saving the book to the db
    book.save().then(()=>{
        console.log("New book created!")
    }).catch((err)=>{
        if(err){
            throw err;
        }
    })
    res.send("A new book created successfully!"); //sending response to show if the post is working or not
});

app.get("/books", (req, res) =>{
    Book.find().then((books) =>{
        res.json(books);
    }).catch( err =>{
        if(err){
            throw(err);
        }
    })
})

//showing a book using its unique id
app.get("/book/:id", (req, res) =>{
    Book.findById(req.params.id).then((book) =>{
        if(book){
            res.json(book);
        }else{
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

//removing a book from db
app.delete("/book/:id", (req, res) =>{
    Book.findOneAndRemove(req.params.id).then(()=>{
        res.send("Book removed successfully!")
    }).catch(err =>{
        if(err){
            throw err;
        }
    })
})

//listening to a port
app.listen(3000, ()=>{
    console.log("Up and running - Books service");
});
