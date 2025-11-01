# restful-api

## API Test Commands

Base URL: `http://localhost:3000`

## GET all books
```bash
curl http://localhost:3000/api/books
```

## GET book by ID
```bash
curl http://localhost:3000/api/books/1
```

## POST create book
```bash
curl -X POST http://localhost:3000/api/books \
-H "Content-Type: application/json" \
-d '{"title":"The Hobbit", "author":"J.R.R. Tolkien", "year":1937}'
```

## POST create another book
```bash
curl -X POST http://localhost:3000/api/books \
-H "Content-Type: application/json" \
-d '{"title":"The Lord of the Rings", "author":"J.R.R. Tolkien", "year":1954}'
```

## PUT update book (partial - just year)
```bash
curl -X PUT http://localhost:3000/api/books/2 \
-H "Content-Type: application/json" \
-d '{"year":1954}'
```

## PUT update book (multiple fields)
```bash
curl -X PUT http://localhost:3000/api/books/2 \
-H "Content-Type: application/json" \
-d '{"title":"The Lord of the Rings", "year":1954}'
```

## DELETE book
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

## Test error cases
```bash
# Try to get non-existent book
curl http://localhost:3000/api/books/999

# Try to delete non-existent book
curl -X DELETE http://localhost:3000/api/books/999