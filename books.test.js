//tests
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async function(){
    await db.query('DELETE FROM books');
});

afterAll(async function(){
    await db.end();
});

describe("Book Routes Test", function(){
    let testBook;

    beforeEach(async function(){
        let result = await db.query(`
            INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
            VALUES ('1234567890', 'https://www.amazon.com', 'Test Author', 'English', 100, 'Test Publisher', 'Test Title', 2021)
            RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`);
        testBook = result.rows[0];
    });

    describe("GET /books", function(){
        test("Get all books", async function(){
            const response = await request(app).get('/books');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({books: [testBook]});
        });
    });

    describe("GET /books/:isbn", function(){
        test("Get a book by isbn", async function(){
            const response = await request(app).get(`/books/${testBook.isbn}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({book: testBook});
        });
    });

    describe("POST /books", function(){
        test("Add a book", async function(){
            const response = await request(app).post('/books').send({
                isbn: '0987654321',
                amazon_url: 'https://www.amazon.com',
                author: 'Test Author 2',
                language: 'English',
                publisher: 'Test Publisher 2',
                title: 'Test Title 2',
                year: 2021
            };
            const response=await request(app).post('/books').send({newBook});
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({book: newBook});
        });
    
    describe("DELETE /books/:isbn", function(){
        test("Delete a book", async function(){
            const response = await request(app).delete(`/books/${testBook.isbn}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({message: "Book deleted"});
        });
    });
    });
});