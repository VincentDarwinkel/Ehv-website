import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Logger from "simple-console-logger";
import Routes from "./routes/Routes";
import ReactModal from "components/shared/modal";

Logger.configure({ level: "debug" });

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={4000} position="top-center" />
      <ReactModal />
      <Routes />
    </div>
  );
}

export default App;
