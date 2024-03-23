function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
}

function favoriteBlog(blogs) {
  if (blogs.length === 0) return null;

  let min = -1;
  const topLikedBlog = blogs.reduce((topBlog, currentBlog) => {
    if (currentBlog.likes > min) {
      min = currentBlog.likes;
      return currentBlog;
    } else {
      return topBlog;
    }
  });

  return {
    title: topLikedBlog.title,
    author: topLikedBlog.author,
    likes: topLikedBlog.likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
