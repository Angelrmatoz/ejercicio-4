// eslint-disable-next-line
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => { 
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
}

export default { dummy, totalLikes };