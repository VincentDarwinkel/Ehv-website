import React, { Component } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadFiles } from "services/file-dropper";
import { createGuid } from "services/shared/form-data-helper";
import "./index.css";
import { isMobile } from "react-device-detect";

export default class FileDropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: [],
      imagesToUpload: [],
      uploadedFilesCount: 0,
      displayFiles: true,
      statuses: [],
      fileUploadLimit: isMobile ? 20 : 40,
    };
  }

  componentDidUpdate = () => {
    const { uploadedFilesCount, selectedFiles } = this.state;
    if (uploadedFilesCount !== 0 && uploadedFilesCount === selectedFiles.length) {
      document.getElementById("fd-select-input").value = "";
      let statuses = this.state.statuses;

      if (!this.state.statuses.some((status) => status.includes("Fout"))) {
        statuses.push("Upload voltooid");
      }

      this.props.onUploadComplete();
      this.setState({ selectedFiles: [], imagesToUpload: [], uploadedFilesCount: 0, statuses });
    }
  };

  componentWillUnmount = () => {
    if (this.timerHandle) {
      // remove timeout to prevent memory leak
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  };

  compressImages = (images, callback) => {
    images.forEach((image) => {
      const objUrl = URL.createObjectURL(image);
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        let canvas = document.createElement("CANVAS");
        let ctx = canvas.getContext("2d");
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);

        const dataURL = canvas.toDataURL("image/webp", 0.6);
        callback(dataURL, image.name);
      };

      img.src = objUrl;

      if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = objUrl;
      }
    });
  };

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const image = new File([u8arr], filename, { type: mime });
    let imagesToUpload = this.state.imagesToUpload;
    imagesToUpload.push(image);
    this.setState({ imagesToUpload }, this.onCompressionComplete);
  };

  onCompressionComplete = async () => {
    let { imagesToUpload, selectedFiles, uploadedFilesCount, statuses } = this.state;
    uploadedFilesCount += 1;

    if (imagesToUpload.length === selectedFiles.filter((file) => file.type !== "video/mp4").length) {
      const formData = new FormData();
      formData.append("path", this.props.currentDirectory);
      this.state.imagesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      const result = await uploadFiles(formData);
      if (result.status === 200) {
        statuses.push("Afbeeldingen geüpload");
      } else {
        statuses.push("Fout tijdens uploaden afbeeldingen");
      }

      this.setState({ statuses });
    }

    this.setState({ uploadedFilesCount });
  };

  // filters the allowed files only and limits the amount of file to upload
  filterUploadedFiles = (fileList) => {
    const allowedFileTypes = ["video/mp4", "image/png", "image/jpg", "image/webp", "image/jpeg"];
    const files = Array.from(fileList);
    const maxFileSize = 26214400; //25 mb

    return files.filter((file) => allowedFileTypes.includes(file.type) && file.size <= maxFileSize).splice(0, this.state.fileUploadLimit);
  };

  // check if user is using mobile data and show an warning if data size is big
  checkUserConnection = () => {
    if (navigator.connection) {
      const type = navigator.connection.type;
      if (type) {
        if (type === "cellular") {
          toast.warning(
            "Waarschuwing je gebruikt mobiele data om bestanden te gaan uploaden dit kan kosten met zich meebrengen of je bundel snel leegtrekken!"
          );
        }
      }
    }
  };

  onFileSelection = (e) => {
    this.checkUserConnection();
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

  uploadVideos = async (selectedVideos) => {
    if (selectedVideos.length !== 0) {
      const formData = new FormData();
      selectedVideos.forEach((video) => formData.append("files", video));

      let statuses = this.state.statuses;
      const result = await uploadFiles(formData, `?path=${this.props.currentDirectory}`);
      if (result.status === 200) {
        statuses.push("Video's geüpload");
      } else {
        statuses.push("Fout tijdens uploaden video");
      }

      this.setState({
        uploadedFilesCount: (this.state.uploadedFilesCount += selectedVideos.length),
        statuses,
      });
    }
  };

  onUpload = async () => {
    this.setState({ statuses: [] });

    const selectedImages = this.state.selectedFiles.filter((file) => file.type !== "video/mp4");
    const selectedVideos = this.state.selectedFiles.filter((file) => file.type === "video/mp4");

    this.compressImages(selectedImages, this.dataURLtoFile);
    await this.uploadVideos(selectedVideos);
  };

  render() {
    return (
      <div id="file-dropper" hidden={this.props.hidden}>
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
        <small>
          Maximale bestandsgrootte 25 MB
          <br />
          Maximaal aantal bestanden {this.state.fileUploadLimit}
        </small>
        <br />
        <div hidden={this.state.selectedFiles.length === 0 && this.state.statuses.length === 0}>
          <b
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => this.setState({ displayFiles: !this.state.displayFiles })}
            aria-controls="collapse-text"
            aria-expanded={this.state.displayFiles}
          >
            {this.state.displayFiles ? (
              <span>
                Verberg bestanden ({this.state.selectedFiles.length - this.state.uploadedFilesCount}) <i className="fas fa-sort-up" />
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
                  {file.type === "video/mp4" ? (
                    <video src={URL.createObjectURL(file)} />
                  ) : (
                    <img alt="Upload" loading="lazy" src={URL.createObjectURL(file)} />
                  )}
                  <div className="fd-option-wrapper">
                    {file.type === "video/mp4" ? <i className="fas fa-video" /> : <i className="far fa-image" />} {file.name}
                  </div>
                  <Button onClick={() => this.onRemove(file.name)} className="fd-remove">
                    <i className="fas fa-times" />
                  </Button>
                </div>
              ))}
            </div>
            <div id="fd-upload-section">
              <Button disabled={this.state.uploadedFilesCount !== 0} onClick={(e) => this.onUpload(e)} block>
                Upload {this.state.uploadedFilesCount !== 0 ? `(${this.state.uploadedFilesCount})` : null}
              </Button>
              <ListGroup>
                {this.state.statuses.map((event) => (
                  <ListGroup.Item key={createGuid()}>
                    {event.includes("Fout") ? (
                      <span>
                        <i className="fas fa-exclamation-triangle" /> {event}
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-check" /> {event}
                      </span>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
