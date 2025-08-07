import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './utils/config.js';
import blogsRouter from './controllers/blogs.js';
import './mongo.js';
import usersRouter from './controllers/users.js';

const app = express(); 
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
    });
}

export default app;