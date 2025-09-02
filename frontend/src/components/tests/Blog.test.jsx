import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../Blog";
import { expect, vi } from "vitest";

test("muestra el título, autor, url y likes del blog", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "John Doe",
    url: "https://testing-library.com/docs/example-react",
    likes: 5,
    user: { name: "John Doe", id: "123" },
  };

  const handleLike = vi.fn();
  const handleRemove = () => {};
  const currentUser = { name: "John Doe", id: "123" };

  render(
    <Blog
      blog={blog}
      handleLike={handleLike}
      handleRemove={handleRemove}
      currentUser={currentUser}
    />
  );

  const element = screen.getByText(
    "Component testing is done with react-testing-library John Doe"
  );

  expect(element).toBeDefined();

  expect(screen.queryByText(blog.url)).toBeNull();
  expect(screen.queryByText(/likes/i)).toBeNull();

  const user = userEvent.setup();
  const button = screen.getByText(/ver más|view/i);
  await user.click(button);

  const likeButton = screen.getByText(/like/i, { selector: "button" });
  await user.click(likeButton);
  await user.click(likeButton);

  expect(screen.getByText(blog.url)).toBeDefined();
  expect(
    screen.getByText(
      (content, element) => content.includes("5") && content.includes("likes")
    )
  ).toBeDefined();

  expect(handleLike).toHaveBeenCalledTimes(2);
});
