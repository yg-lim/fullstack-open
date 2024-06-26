import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm';
import Notification from './components/Notification'
import { LoginForm } from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("authenticatedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])

  function handleUsername(event) {
    setUsername(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('authenticatedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setNotification({
        type: 'success',
        message: 'you have successfully logged in'
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotification({
        type: 'error',
        message: exception.response.data,
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("authenticatedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  }

  async function handleNewBlog(event) {
    event.preventDefault();

    try {
    const result = await blogService.newBlog({ title, author, url });
    setBlogs(blogs.concat(result));
    setNotification({
      type: 'success',
      message: `new blog ${result.title} by ${result.author} added`
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000)
    setTitle('');
    setAuthor('');
    setUrl('');
    } catch (exception) {
      setNotification({
        type: 'error',
        message: exception.response.data.error,
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }

  function handleTitle(event) {
    setTitle(event.target.value);
  }

  function handleAuthor(event) {
    setAuthor(event.target.value);
  }

  function handleUrl(event) {
    setUrl(event.target.value);
  }

  return (
    <div>
      <Notification notification={notification} />

      {user ?
      (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <input type="button" value="logout" onClick={handleLogout} /></p> 
          <BlogForm props={{
            title,
            author,
            url,
            handleTitle,
            handleAuthor,
            handleUrl,
            handleNewBlog,
          }} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      ) :
      (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsername={handleUsername}
          handlePassword={handlePassword}
        />
      )}
    </div>
  );
}

export default App