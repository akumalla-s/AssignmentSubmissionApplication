function App() {
  const reqBody = {
    username: "test",
    password: "test",
  };

  fetch("api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  })
    .then((response) => Promise.all([response.json(), response.headers]))
    .then(([body, headers]) => {
      const authValue = headers.get("authorization");
      console.log(authValue);
      console.log(body);
    });

  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
