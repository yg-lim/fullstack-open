function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
}

module.exports = {
  dummy,
  totalLikes,
}
