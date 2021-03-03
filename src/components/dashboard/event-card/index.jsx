import React, { Component } from "react";
import routerPaths from "services/shared/router-paths";

export default class EventCard extends Component {
  generateList = () => {
    return this.props.events?.map((event) => (
      <a href={`${routerPaths.Event}#/${event.uuid}`} key={"event-card-" + event.uuid}>
        <li className="list-group-item dashboard-event-card-list-item">{event.title}</li>
      </a>
    ));
  };

  render() {
    return (
      <div className="dashboard-card ehv-card" key={this.props.title}>
        <h5 className="card-title">{this.props.title}</h5>
        <ul className="list-group">{this.generateList()}</ul>
      </div>
    );
  }
}
