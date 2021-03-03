import React, { Component } from "react";

export default class SiteAdminCard extends Component {
  render() {
    return (
      <div className="site-admin-card ehv-card" key={this.props.cardTitle}>
        <a href={this.props.route}>
          {this.props.icon}
          <h5>{this.props.title}</h5>
        </a>
        <hr />
        {this.props.children}
      </div>
    );
  }
}
