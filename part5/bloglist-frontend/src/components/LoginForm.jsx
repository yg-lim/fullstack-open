export function LoginForm({
  username,
  password,
  handleLogin,
  handlePassword,
  handleUsername,
}) {
  return (
    <>
      <h1>log in to application</h1>
      <form action="" onSubmit={handleLogin}>
        username <input type="text" name="username" id="username" value={username} onChange={handleUsername} />
        password <input type="password" name="password" id="password" value={password} onChange={handlePassword} />
        <input type="submit" value="login" />
      </form>
    </>
  );
}