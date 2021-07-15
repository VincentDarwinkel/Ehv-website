import "./index.css";
import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <div className="linear-activity">
        <div className="indeterminate"></div>
      </div>
    );
  }
}
