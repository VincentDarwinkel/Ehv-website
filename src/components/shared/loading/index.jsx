import "./index.css";
import React, { Component } from "react";

export default class Loading extends Component {
  constructor() {
    super();
    this.state = {
      timeout: false,
    };
  }

  componentDidMount = () => {
    this.timerHandle = setTimeout(() => {
      this.setState({ timeout: true });
    }, 5000);
  };

  componentWillUnmount = () => {
    if (this.timerHandle) {
      // remove timeout to prevent memory leak
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  };

  render() {
    const size = this.props.size === "small" ? "small" : "medium";
    return (
      <div>
        {this.state.timeout ? (
          "Fout tijdens laden"
        ) : (
          <div className={`loading ${size === "small" ? "loading-small" : "loading-medium" ?? "loading-medium"}`}></div>
        )}
      </div>
    );
  }
}
