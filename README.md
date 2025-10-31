# restful-api

## API Test Commands

`Base URL: http://localhost:3000`

## GET all books

`curl http://localhost:3000/books`

## POST create book

` curl -X POST http://localhost:3000/books \ -H "Content-Type: application/json" \ -d '{"title":"Atomic Habits","author":"James Clear","year":2018}' `


## PUT update book

` curl -X PUT http://localhost:3000/books/1 \ -H "Content-Type: application/json" \ -d '{"title":"Atomic Habits (Updated)"}'`

## DELETE book

` curl -X DELETE http://localhost:3000/books/1`