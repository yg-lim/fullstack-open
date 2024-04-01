export default function BlogForm({ props }) {
  return (
    <form action="" onSubmit={props.handleNewBlog}>
      <p>title: <input type="text" name="title" id="title" value={props.title} onChange={props.handleTitle} /></p>
      <p>author: <input type="text" name="author" id="author" value={props.author} onChange={props.handleAuthor} /></p>
      <p>url: <input type="text" name="url" id="url" value={props.url} onChange={props.handleUrl} /></p>
      <input type="submit" value="Create" />
    </form>
  )
}