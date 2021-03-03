import "components/shared/loading/index.css";
import React, { Component } from "react";
import "./index.css";

export default class ReactModal extends Component {
  constructor() {
    super();

    this.state = {
      showModal: false,
    };
  }

  openModal = () => {
    this.setState({
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    return (
      <div className="react-modal fade-down" hidden={!this.props.showModal}>
        <div className="react-modal-content">
          <h4>{this.props.title}</h4>
          <p>{this.props.description}</p>
          <div className="react-modal-btn-group">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
