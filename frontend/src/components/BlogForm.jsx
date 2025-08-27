import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={newBlog.title}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="author">Author</label>
      <input
        id="author"
        type="text"
        name="author"
        value={newBlog.author}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="url">URL</label>
      <input
        id="url"
        type="text"
        name="url"
        value={newBlog.url}
        onChange={handleChange}
      />
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
