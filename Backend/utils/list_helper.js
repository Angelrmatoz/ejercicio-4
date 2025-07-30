// eslint-disable-next-line
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const fav = blogs.reduce((prev, curr) => (curr.likes || 0) > (prev.likes || 0) ? curr : prev);

    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

export default { dummy, totalLikes, favoriteBlog };