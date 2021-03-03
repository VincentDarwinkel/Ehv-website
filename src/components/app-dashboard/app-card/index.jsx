import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <div className="app-card" id={this.props.id}>
        <a href={this.props.href}>
          <label className="app-card-img">{this.props.img}</label>
          <p>{this.props.appName}</p>
        </a>
      </div>
    );
  }
}

export default App;
