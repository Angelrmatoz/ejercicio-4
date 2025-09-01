import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const isOwner =
    blog.user &&
    (blog.user.name === currentUser.name || blog.user === currentUser.id);

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "hide" : "view"}
      </button>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} likes</p>
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
      )}
      <div>{blog.user && blog.user.name}</div>
      {isOwner && (
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => handleRemove(blog)}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Blog;