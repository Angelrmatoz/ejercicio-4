import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.error("Login failed:", exception);
    }
  };

  const blogFormRef = useRef();

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create({
        title: blogObject.title,
        author: blogObject.author,
        url: blogObject.url,
        likes: 0,
      });

      setBlogs(blogs.concat(createdBlog));
      blogFormRef.current?.toggleVisibility();

      setNotification({
        message: `A new blog '${createdBlog.title}' by ${createdBlog.author} added`,
        type: "success",
      });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 4000);
    } catch (exception) {
      console.error("Failed to create blog:", exception);
      setNotification({
        message: "Failed to create blog",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 4000);
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === "object" ? blog.user.id : blog.user,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    setBlogs(blogs.map((b) => (b.id === blog.id ? returnedBlog : b)));
  };

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    }
  };

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <h3>
        {user.name} logged in
        <button
          onClick={() => {
            window.localStorage.removeItem("loggedBlogAppUser");
            blogService.setToken(null);
            setUser(null);
          }}
        >
          Logout
        </button>
      </h3>

      <Togglable buttonLabel="Create new Blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <br />
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            currentUser={user}
            handleRemove={handleRemove}
          />
        ))}
    </div>
  );
};

export default App;
