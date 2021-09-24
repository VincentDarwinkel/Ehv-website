import React, { Component } from "react";
import "./index.css";
import { isMobile } from "react-device-detect";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadFiles } from "services/file-dropper";
import { stringIsNullOrEmpty } from "services/shared/form-data-helper";

export default class FileDropper extends Component {
  constructor(props) {
    super(props);
  }

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

    const files = this.filterUploadedFiles(e.target.files);
    if (files.length < e?.target?.files?.length) {
      toast.warning("Sommige bestanden zijn niet geüpload omdat deze groter dan 25MB zijn");

      if (files.length === 0) {
        return;
      }
    }

    this.upload(files);
  };

  upload = async (filesToUpload) => {
    if (stringIsNullOrEmpty(this.props?.currentDirectory)) {
      return;
    }

    const currentDir = this.props.currentDirectory;
    let formData = new FormData();
    formData.append("path", currentDir);
    filesToUpload.forEach((file) => formData.append("files", file));
    uploadFiles(formData).then((value) => {
      this.props.onFinished(currentDir);
      toast.success("Bestanden zijn verwerkt");
    });
    toast.success("Bestanden worden in de achtergrond verwerkt en zullen binnenkort in de map te zien zijn");
  };

  render() {
    return (
      <label className="link-btn">
        <i className="fas fa-plus" />
        <span className="m-1">Voeg bestanden toe</span>
        <Form.Control
          onChange={(e) => this.onFileUpload(e)}
          multiple={true}
          accept=".mp4,.webp.,webm,.png,.jpeg,.jpg,.mov,.avi"
          className="d-none"
          type="file"
          multiple
        />
      </label>
    );
  }
}
