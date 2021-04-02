import React, { Component } from "react";
import "./index.css";

export default class EmptyFolder extends Component {
  render() {
    return (
      <div id="empty-folder">
        <br />
        <i id="empty-folder-icon" className="far fa-folder-open" />
        <h6>Leeg</h6>
      </div>
    );
  }
}
