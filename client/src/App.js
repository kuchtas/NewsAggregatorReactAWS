import React from "react";
import "./App.css";
import Header from "./components/Header";
import Body from "./components/Body";

function App() {
  sessionStorage.clear();
  return (
    <div>
      <Header />
      <Body />
    </div>
  );
}

export default App;
