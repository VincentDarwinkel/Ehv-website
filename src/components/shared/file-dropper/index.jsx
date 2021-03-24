import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createGuid } from "services/shared/form-data-helper";
import "./index.css";
export default class FileDropper extends Component {
  constructor() {
    super();
    this.state = {
      compressedImages: [],
      selectedFiles: [],
      displayFiles: true,
    };
  }

  onCompressionComplete = (compressedFile) => {
    let compressedImages = this.state.compressedImages;
    compressedImages.push(compressedFile);
  };

  compressImage = (image, callback) => {
    const objUrl = URL.createObjectURL(image);

    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);

      dataURL = canvas.toDataURL("image/webp", 0.6);
      callback(dataURL);
    };

    img.src = objUrl;

    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = objUrl;
    }
  };

  // filters the allowed files only
  filterUploadedFiles = (fileList) => {
    const allowedFileTypes = ["video/mp4", "image/png", "image/jpg", "image/webp", "image/jpeg"];
    const files = Array.from(fileList);
    const maxFileSize = this.props.maxFileSize ?? 500000000; // default 500 MB

    return files.filter((file) => allowedFileTypes.includes(file.type) && file.size <= maxFileSize);
  };

  onFileSelection = (e) => {
    const selectedFiles = this.filterUploadedFiles(e.target.files);
    if (selectedFiles.length !== e.target.files.length) {
      toast.error("Sommige bestanden zijn niet toegevoegd omdat deze niet geüpload kunnen worden");
    }

    this.setState({ selectedFiles });
  };

  onRemove = (fileName) => {
    let selectedFiles = this.state.selectedFiles;
    const fileIndex = selectedFiles.findIndex((file) => file.name === fileName);
    if (fileIndex !== -1) {
      selectedFiles.splice(fileIndex, 1);
      this.setState({ selectedFiles });
    }
    if (selectedFiles.length === 0) {
      document.getElementById("fd-select-input").value = "";
    }
  };

  render() {
    return (
      <div id="file-dropper">
        <label className="btn btn-light">
          Bestanden kiezen <i className="fas fa-photo-video" />
          <Form.Control
            multiple={true}
            accept=".png, .jpg, .webp, .jpeg, .mp4"
            className="d-none"
            type="file"
            onChange={(e) => this.onFileSelection(e)}
            id="fd-select-input"
          />
        </label>
        <br />
        <small>Maximale bestandsgrootte {this.props.maxFileSize ?? "500 MB"}</small>
        <br />
        <div hidden={this.state.selectedFiles.length === 0}>
          <b
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => this.setState({ displayFiles: !this.state.displayFiles })}
            aria-controls="collapse-text"
            aria-expanded={this.state.displayFiles}
          >
            {this.state.displayFiles ? (
              <span>
                Verberg bestanden ({this.state.selectedFiles.length}) <i className="fas fa-sort-up" />
              </span>
            ) : (
              <span>
                Weergeef bestanden <i className="fas fa-sort-down" />
              </span>
            )}
          </b>
          <div hidden={!this.state.displayFiles} className="fade-down">
            <div id="selected-files">
              {this.state.selectedFiles.map((file) => (
                <div key={createGuid()} className="selected-file ehv-card">
                  {file.type === "video/mp4" ? <video src={URL.createObjectURL(file)} /> : <img loading="lazy" src={URL.createObjectURL(file)} />}
                  <input placeholder="Omschrijving" />
                  <Button onClick={() => this.onRemove(file.name)} className="fd-remove">
                    <i className="fas fa-times" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
