import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
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

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;

    try {
      const createdBlog = await blogService.create({
        title,
        author,
        url,
        likes: 0,
      });

      setBlogs(blogs.concat(createdBlog));
      setNewBlog({ title: "", author: "", url: "" });
      event.target.reset();

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

      <form onSubmit={handleCreateBlog}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        />
        <br />
        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          value={newBlog.author}
          onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
        />
        <br />
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="text"
          value={newBlog.url}
          onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
        />
        <br />
        <button type="submit">Create</button>
      </form>
      <br />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
