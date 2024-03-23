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

function sortByAuthorAndBlogCount(blogs) {
  const authors = {};

  blogs.forEach(blog => {
    const author = blog.author;

    if (authors.hasOwnProperty(author)) {
      authors[author] += 1;
    } else {
      authors[author] = 1;
    }
  })

  return authors;
}

function mostBlogs(blogs) {
  if (blogs.length === 0) return {};
  const authors = sortByAuthorAndBlogCount(blogs);
  
  let min = -1;
  const topAuthor = Object.keys(authors).reduce((author, currentAuthor) => {
    if (authors[currentAuthor] > min) {
      min = authors[currentAuthor];
      return currentAuthor;
    } else {
      return author;
    }
  });

  return {
    author: topAuthor,
    blogs: authors[topAuthor]
  }
}

function sortByAuthorAndLikes(blogs) {
  const authors = {};

  blogs.forEach(blog => {
    let author = blog.author;
    if (authors.hasOwnProperty(author)) {
      authors[author] += blog.likes;
    } else {
      authors[author] = blog.likes;
    }
  })
  
  return authors;
}

function mostLikes(blogs) {
  if (blogs.length === 0) return {};
  const authors = sortByAuthorAndLikes(blogs);

  let min = -1;
  const topAuthor = Object.keys(authors).reduce((author, currentAuthor) => {
    if (authors[currentAuthor] > min) {
      min = authors[currentAuthor];
      return currentAuthor;
    } else {
      return author;
    }
  });

  return {
    author: topAuthor,
    likes: authors[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
