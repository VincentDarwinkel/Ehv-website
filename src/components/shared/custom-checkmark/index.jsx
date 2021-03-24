import React, { Component } from "react";
import { createGuid } from "services/shared/form-data-helper";
import "./index.css";

export default class CustomCheckmark extends Component {
  render() {
    return (
      <label className="container" key={createGuid()}>
        {this.props.text}
        <input onClick={this.props.onClick} type="checkbox" defaultChecked={this.props.checked} />
        <span className="checkmark" />
      </label>
    );
  }
}
