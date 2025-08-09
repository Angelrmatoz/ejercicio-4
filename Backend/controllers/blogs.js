import Blog from '../models/blog.js';
import express from 'express';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => { 
    const { title, author, url, likes } = request.body;

    if (!title || !url) {
        return response.status(400).json({ error: 'title and url are required' });
    }

    if (likes === undefined) {
        return response.status(400).json({ error: 'likes is missing' });
    }

    const blog = new Blog({ title, author, url, likes });
    const result = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    const populatedBlog = await result.populate('user', { username: 1, name: 1 });

    response.status(201).json(populatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const { id } = request.params;

    const blogActualizado = await Blog.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });

    if (!blogActualizado) {
        return response.status(404).end();
    }

    response.json(blogActualizado);
});

export default blogsRouter;