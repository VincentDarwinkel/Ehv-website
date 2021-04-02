import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { CreateDirectory } from "services/directory-creator";
import "./index.css";

export default class DirectoryCreator extends Component {
  onSubmit = async (e) => {
    if (e.key !== "Enter") {
      return;
    }

    const value = e.target.value;
    if (value.length === 0) {
      toast.error("Naam mag niet leeg zijn");
      return;
    }
    if (!value.match("[a-zA-Z0-9]")) {
      toast.error("Naam mag alleen letters en nummers bevatten");
      return;
    }

    const formData = new FormData();
    formData.append("name", value);
    formData.append("parentPath", this.props.currentDirectory);

    const result = await CreateDirectory(formData);
    if (result.status === 200) {
      this.props.callback();
      document.getElementById("dc-input").value = "";
    }
  };

  render() {
    return (
      <div id="directory-creator" hidden={this.props.hidden}>
        <Form.Control onKeyUp={this.onSubmit} id="dc-input" placeholder="Druk enter om aan te maken" />
      </div>
    );
  }
}
