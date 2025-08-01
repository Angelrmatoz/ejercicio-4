import Blog from '../models/blog.js';
import express from 'express';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post('/', (request, response) => { 
    const blog = new Blog(request.body);
    const result = blog.save();
    response.status(201).json(result);
});

export default blogsRouter;