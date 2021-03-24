import React, { Component } from "react";
import "./index.css";
import Header from "components/shared/header";
import FileDropper from "components/shared/file-dropper";
export default class Gallery extends Component {
  render() {
    return (
      <div>
        <Header pageName="Galerij" />
        <div className="content">
          <FileDropper />
        </div>
      </div>
    );
  }
}
