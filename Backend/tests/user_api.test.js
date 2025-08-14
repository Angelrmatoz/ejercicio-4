import app from '../index.js';
import mongoose from 'mongoose';
import supertest from 'supertest';
import User from '../models/user.js';

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
});

test('POST /api/users', async () => {
    const newUser = {
        username: 'johndoe',
        name: 'John Doe',
        password: 'password123'
    };

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    const usernames = usersAtEnd.body.map(u => u.username);
    expect(usernames).toContain(newUser.username);
});

test('GET /api/users', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
    await mongoose.connection.close();
});