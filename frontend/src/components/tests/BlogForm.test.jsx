import BlogForm from "../BlogForm";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

test("renders the blog form", async () => {

    const createBlog = vi.fn();

    render(<BlogForm createBlog={createBlog} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/title/i), "Test Blog");
    await user.type(screen.getByLabelText(/author/i), "John Doe");
    await user.type(screen.getByLabelText(/url/i), "https://example.com");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(createBlog).toHaveBeenCalledTimes(1);
    expect(createBlog).toHaveBeenCalledWith({
        title: "Test Blog",
        author: "John Doe",
        url: "https://example.com",
    });
});
