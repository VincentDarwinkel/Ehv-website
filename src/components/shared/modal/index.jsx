import "components/shared/loading/index.css";
import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import "./index.css";

export default class ReactModal extends Component {
  render() {
    return (
      <div className="react-modal fade-down" hidden={!this.props.modalOptions?.show}>
        <div className="react-modal-content">
          <p>{this.props.modalOptions?.description}</p>
          <div className="react-modal-btn-group">
            <ButtonGroup>
              <Button
                variant="danger"
                onClick={() => {
                  this.props.modalOptions?.close();
                  this.props.modalOptions?.callback();
                }}
              >
                Doorgaan
              </Button>
              <Button onClick={() => this.props.modalOptions?.close()}>Annuleren</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    );
  }
}
