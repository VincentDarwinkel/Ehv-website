import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Logger from "simple-console-logger";
import Routes from "./routes/Routes";

Logger.configure({ level: "debug" });

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={4000} position="top-center" />
      <Routes />
    </div>
  );
}

export default App;
