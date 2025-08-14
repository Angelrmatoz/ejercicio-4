import User from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!password || password.length < 3) {
        return res.status(400).json({ error: 'password is required and must be at least 3 characters long' });
    } else if (!username || username.length < 3) {
        return res.status(400).json({ error: 'username is required and must be at least 3 characters long' });
    } else if (existingUser) {
        return res.status(400).json({ error: 'username must be unique' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ username, name, passwordHash });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
    res.json(users);
})

export default usersRouter;