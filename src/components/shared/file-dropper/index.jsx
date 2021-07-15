import React, { Component } from "react";
import "./index.css";
import { isMobile } from "react-device-detect";
import { Form, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadFiles } from "services/file-dropper";

export default class FileDropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filesToUpload: [],
      fileBlobUrls: [],
    };
  }

  componentWillUnmount = () => {
    this.clearObjectUrls();
  };

  clearObjectUrls = () => {
    let { fileBlobUrls } = this.state;
    fileBlobUrls.forEach((fileUrl) => URL.revokeObjectURL(fileUrl));
    fileBlobUrls = [];
    this.setState({ fileBlobUrls });
  };

  // filters the allowed files only and limits the amount of file to upload
  filterUploadedFiles = (fileList) => {
    const allowedFileTypes = ["video/mp4", "image/png", "image/jpg", "image/webp", "image/jpeg"];
    const files = Array.from(fileList);
    const maxFileSize = 26214400; //25 mb

    return files.filter((file) => allowedFileTypes.includes(file.type) && file.size <= maxFileSize);
  };

  onFileUpload = (e) => {
    e.preventDefault();
    if (isMobile && e?.target?.files?.length > 150) {
      toast.error("Telefoons kunnen niet meer dan 150 bestanden uploaden");
      return;
    }

    document.getElementById("fd-select").style.display = "none";
    const files = this.filterUploadedFiles(e.target.files);
    if (files.length < e?.target?.files?.length) {
      document.getElementById("fd-select").style.display = "inline-block";
      toast.warning("Sommige bestanden zijn niet geüpload omdat deze groter dan 25MB zijn");

      if (files.length === 0) {
        return;
      }
    }

    this.setState({ filesToUpload: files });
    document.getElementById("fd-upload-btn").hidden = false;
  };

  generatePreview = (file) => {
    const objUrl = URL.createObjectURL(file);
    let { fileBlobUrls } = this.state;
    fileBlobUrls.push(objUrl);

    if (file?.type === "video/mp4") {
      return <video className="fd-preview" src={objUrl} />;
    }

    return <img className="fd-preview" src={objUrl} />;
  };

  deletePreview = (file) => {
    let { filesToUpload } = this.state;
    const indexToRemove = filesToUpload.findIndex((item) => item?.name === file?.name);
    if (indexToRemove !== -1) {
      filesToUpload.splice(indexToRemove, 1);
    }

    this.setState({ filesToUpload });
    if (filesToUpload.length === 0) {
      document.getElementById("fd-select").style.display = "inline-block";
      document.getElementById("fd-file-input").value = "";
      document.getElementById("fd-upload-btn").hidden = true;
    }
  };

  upload = () => {
    this.clearObjectUrls();
    const { filesToUpload } = this.state;

    let formData = new FormData();
    formData.append("path", "/Media/Public/Gallery/2021");
    filesToUpload.forEach((file) => formData.append("files", file));
    uploadFiles(formData);
  };

  render() {
    return (
      <div className="ehv-card-no-padding" id="fd-wrapper">
        <label className="btn btn-light mt-4 mb-4" id="fd-select">
          <i className="fas fa-plus" />
          <span className="m-1">Voeg bestanden toe</span>
          <Form.Control
            id="fd-file-input"
            multiple={false}
            accept=".mp4,.webp.,webm,.png,.jpeg,.jpg,.mov,.avi"
            className="d-none"
            type="file"
            onChange={(e) => this.onFileUpload(e)}
            multiple
          />
        </label>
        <Table striped bordered hover responsive variant="dark" size="sm">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "10%" }}>Preview</th>
              <th>Bestandsnaam</th>
              <th style={{ width: "6%" }}>Type</th>
              <th style={{ width: "6%" }}>Grootte</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.filesToUpload.map((file, index) => (
              <tr className="fade-down">
                <td>{index + 1}</td>
                <td>{this.generatePreview(file)}</td>
                <td>{file.name}</td>
                <td>
                  {file.type === "video/mp4" ? (
                    <div>
                      <i className="fas fa-video" />
                      <br /> Video
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-camera" />
                      <br /> Image
                    </div>
                  )}
                </td>
                <td>{Math.round((file?.size / 1000000) * 100) / 100}MB</td>
                <td>
                  <i onClick={() => this.deletePreview(file)} className="fas fa-trash-alt btn" style={{ color: "red" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={this.upload} id="fd-upload-btn" hidden className="w-100">
          Uploaden
        </Button>
      </div>
    );
  }
}
