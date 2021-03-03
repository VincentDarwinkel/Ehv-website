import React, { Component } from "react";
import colorIsLight from "services/shared/font-color-helper";
import "./index.css";

export default class CustomProgressBar extends Component {
  render() {
    return (
      <div hidden={this.props?.value === ""} style={{ backgroundColor: this.props.backgroundColor }} className="custom-progress-bar-wrapper">
        <div
          className={`${this.props.className} custom-progress-bar`}
          style={{
            backgroundColor: this.props?.color ?? "#3674e3",
            width: this.props?.value + "%",
            color: colorIsLight(this.props?.color ?? "#3674e3") || this.props?.value === 0 ? "black" : "white",
          }}
        >
          <span>{this.props?.text}</span>
        </div>
      </div>
    );
  }
}
