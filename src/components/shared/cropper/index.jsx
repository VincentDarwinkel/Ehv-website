import "components/shared/loading/index.css";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Cropper } from "react-cropper";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import "cropperjs/dist/cropper.css";
import "./index.css";

export default class CropperWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImage: null,
      croppedImage: null,
    };
  }

  validateAvatar = (image) => {
    const file = image.target.files[0];
    if (file?.type !== "image/png" && file?.type !== "image/jpg" && file?.type !== "image/webp" && file?.type !== "image/jpeg") {
      toast("Bestand is geen afbeelding");
      return false;
    }

    return true;
  };

  onUpload = (e) => {
    if (!this.validateAvatar(e)) {
      return false;
    }

    const uploadedImage = URL.createObjectURL(e.target.files[0]);
    this.setState({
      uploadedImage,
    });
  };

  getCroppedImage = () => {
    const base64 = this.cropper.getCroppedCanvas()?.toDataURL("image/webp", 0.5);
    this.setState({ croppedImage: base64 });
    return base64;
  };

  onCropperInit(cropper) {
    this.cropper = cropper;
  }

  render() {
    return (
      <div>
        <Cropper
          style={{ height: this.state.uploadedImage !== null ? "30vh" : "0", width: "100%" }}
          initialAspectRatio={1}
          preview=".img-preview"
          src={this.state.uploadedImage}
          viewMode={1}
          guides
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive
          autoCropArea={1}
          checkOrientation={true}
          onInitialized={this.onCropperInit.bind(this)}
        />
        <div className="mt-2">
          <Button data-tip="Afbeelding draaien" data-for="cropper-tip" variant="secondary" className="m-1" onClick={() => this.cropper.rotate(-90)}>
            <i className="fas fa-undo" />
          </Button>
          <Button
            data-tip="Afbeelding verwijderen"
            data-for="cropper-tip"
            variant="secondary"
            onClick={() => {
              this.cropper.reset();
              this.cropper.clear();
              this.cropper.destroy();
              this.setState({ uploadedImage: null, croppedImage: null });
            }}
          >
            <i className="fas fa-times" />
          </Button>
          <ReactTooltip delayShow={500} html={true} id="cropper-tip" place="bottom" effect="solid" />
        </div>
        <label className="btn btn-light mt-4 mb-4 w-100">
          Upload <i className="fas fa-cloud-upload-alt" />
          <Form.Control multiple={false} accept=".png, .jpg, .webp, .jpeg," className="d-none" type="file" onChange={(e) => this.onUpload(e)} />
        </label>
        <div className="box" style={{ width: "100%" }}>
          <div className="img-preview" style={{ width: "100%", height: this.state?.uploadedImage !== null ? "300px" : "0", maxHeight: "300px" }} />
        </div>
      </div>
    );
  }
}
