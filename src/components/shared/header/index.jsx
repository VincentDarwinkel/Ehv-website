import React, { Component } from "react";
import Loading from "../loading";
import TopBar from "./top-bar";
import "./index.css";

export default class Header extends Component {
  render() {
    return (
      <div id="header">
        <TopBar pageName={this.props.pageName} />
        {this.props.loading ? (
          <div id="header-loading">
            <Loading />
          </div>
        ) : null}
      </div>
    );
  }
}
