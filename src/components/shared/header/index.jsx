import React, { Component } from "react";
import Menu from "./menu";
import TopBar from "./top-bar";

export default class Header extends Component {
  render() {
    return (
      <div>
        <TopBar pageName={this.props.pageName} />
        <Menu />
      </div>
    );
  }
}
