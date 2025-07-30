import mongoose from "mongoose";
import supertest from "supertest";
import app from "../index.js"; // Adjust the import based on your file structure
import Blog from "../models/blog.js";

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = [
        { title: "Blog 1", author: "Author 1", url: "http://example.com/1", likes: 5 },
        { title: "Blog 2", author: "Author 2", url: "http://example.com/2", likes: 10 }
    ].map(blog => new Blog(blog));

    await Blog.insertMany(blogObjects);
});

test('los blogs se devuelven como json', async () => { 
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

afterAll(() => { 
    mongoose.connection.close();
});