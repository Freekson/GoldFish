function App() {
  //! test backend
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));

  return <div className="App"></div>;
}

export default App;
