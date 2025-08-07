import User from '../models/user.js';
import express from 'express';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    if (!password || password.length < 3) {
        return res.status(400).json({ error: 'password is required and must be at least 3 characters long' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ username, name, passwordHash });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

export default usersRouter;