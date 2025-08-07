import mongoose from "mongoose";
import supertest from "supertest";
import app from "../index.js";
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

test('la propiedad única de los blogs es id, no _id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined();
        expect(blog._id).toBeUndefined();
    });
});

test('se crea un nuevo blog con POST', async () => { 
    const nuevoBlog = {
        title: "Blog nuevo",
        author: "Autor nuevo",
        url: "http://ejemplo.com/nuevo",
        likes: 7
    };

    const blogsAntes = await api.get('/api/blogs');
    const cantidadAntes = blogsAntes.body.length;

    await api
        .post('/api/blogs')
        .send(nuevoBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const blogsDespues = await api.get('/api/blogs');
    const cantidadDespues = blogsDespues.body.length;

    expect(cantidadDespues).toBe(cantidadAntes + 1);
    const titulos = blogsDespues.body.map(blog => blog.title);
    expect(titulos).toContain(nuevoBlog.title);
});

test('faltan los likes', async () => {
    const nuevoBlog = {
        title: "Blog sin likes",
        author: "Autor sin likes",
        url: "http://ejemplo.com/sin-likes"
    };

    await api
        .post('/api/blogs')
        .send(nuevoBlog)
        .expect(400);
});

test('se elimina un blog con DELETE', async () => {
    const blogsAntes = await api.get('/api/blogs');
    const blogParaEliminar = blogsAntes.body[0];

    await api
        .delete(`/api/blogs/${blogParaEliminar.id}`)
        .expect(204);

    const blogsDespues = await api.get('/api/blogs');
    expect(blogsDespues.body).not.toContainEqual(blogParaEliminar);
});

test('se actualiza un blog con PUT', async () => {
    const blogsAntes = await api.get('/api/blogs');
    const blogParaActualizar = blogsAntes.body[0];

    const blogActualizado = {
        title: "Blog actualizado",
        author: "Autor actualizado",
        url: "http://ejemplo.com/actualizado",
        likes: 15
    };

    await api
        .put(`/api/blogs/${blogParaActualizar.id}`)
        .send(blogActualizado)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const blogsDespues = await api.get('/api/blogs');
    expect(blogsDespues.body).toContainEqual({ ...blogActualizado, id: blogParaActualizar.id });
});

afterAll(() => {
    mongoose.connection.close();
});