import React, { Component } from "react";
import "./index.css";
import Header from "components/shared/header";
import FileDropper from "components/shared/file-dropper";
import { GetFile, GetFileNamesFromDirectory, GetDirectoryInfo, RemoveFile } from "services/gallery";
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";
import ReactModal from "components/shared/modal";
import EmptyFolder from "components/shared/empty-folder";

export default class Gallery extends Component {
  constructor() {
    super();
    this.state = {
      currentDirectory: "/public/gallery/",
      currentItems: [],
      galleryCards: [],
      filesOwnedByUser: [],
      fileViewer: null,
      hideVideoView: true,
      xDown: null,
      yDown: null,
      showModal: false,
      modalAction: null,
    };
  }

  componentDidMount = () => {
    this.getDirectoryData();
  };

  getTouches = (evt) => {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  };

  handleTouchStart = (evt) => {
    const firstTouch = this.getTouches(evt)[0];
    const xDown = firstTouch.clientX;
    const yDown = firstTouch.clientY;
    this.setState({ xDown, yDown });
  };

  handleTouchMove = (evt) => {
    let { xDown, yDown } = this.state;
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        this.handleFileViewerCommand("next");
      } else {
        this.handleFileViewerCommand("previous");
      }
    } else {
      this.handleFileViewerCommand("close");
    }

    /* reset values */
    xDown = null;
    yDown = null;

    this.setState({ xDown, yDown });
  };

  getDirectoryData = async () => {
    const filesResponse = await GetFileNamesFromDirectory(this.state.currentDirectory);
    const directoryInfoResponse = await GetDirectoryInfo(this.state.currentDirectory);

    if (filesResponse.status === 200 || directoryInfoResponse.status === 200) {
      const items = await filesResponse.json();
      const directoryInfo = await directoryInfoResponse.json();

      this.setState({ currentItems: items, filesOwnedByUser: directoryInfo.filesOwnedByUser }, this.renderGalleryData);
    }
  };

  renderImageCard = (image, fileUuid) => {
    let { galleryCards } = this.state;
    const url = URL.createObjectURL(image);
    galleryCards.push(
      <div key={url} className="ehv-card-no-padding">
        <img onClick={() => this.setState({ fileViewer: url })} src={url} />
        {this.state.currentItems.some((item) => item.includes(fileUuid)) ? (
          <Button onClick={() => this.setState({ modalAction: () => this.removeItem(fileUuid, url), showModal: true })} block>
            Verwijderen
          </Button>
        ) : null}
      </div>
    );

    this.setState({ galleryCards });
  };

  removeItem = async (fileUuid, objectUrl) => {
    const result = await RemoveFile(fileUuid);
    if (result.status === 200) {
      URL.revokeObjectURL(objectUrl);
      let { currentItems, galleryCards } = this.state;
      currentItems = currentItems.filter((item) => !item.includes(fileUuid));
      galleryCards = galleryCards.filter((card) => card.key !== objectUrl);

      this.setState({ currentItems, galleryCards, modalAction: null, showModal: false });
    }
  };

  renderVideoCard = (video, fileUuid) => {
    let { galleryCards } = this.state;
    const url = URL.createObjectURL(video);
    galleryCards.push(
      <div key={url} className="ehv-card-no-padding">
        <ReactPlayer style={{ width: "100%", height: "100%" }} className="gallery-video-player" url={url} controls={true} />
        {this.state.currentItems.some((item) => item.includes(fileUuid)) ? (
          <Button onClick={() => this.setState({ modalAction: () => this.removeItem(fileUuid, url), showModal: true })} block>
            Verwijderen
          </Button>
        ) : null}
      </div>
    );

    this.setState({ galleryCards });
  };

  onDirectoryCardClick = (directoryName) => {
    let { currentDirectory, galleryCards } = this.state;
    galleryCards.forEach((card) => {
      // clear previous files
      URL.revokeObjectURL(card.key);
    });

    currentDirectory = `${currentDirectory}${directoryName}/`;
    this.setState({ currentDirectory, currentItems: [], galleryCards: [] }, this.getDirectoryData);
  };

  generateDirectoryCards = (directories) => {
    let directoryCards = [];
    directories.forEach((directoryName) => {
      directoryCards.push(
        <div key={directoryName} onClick={() => this.onDirectoryCardClick(directoryName)} className="ehv-card directory-card">
          <i className="fas fa-folder" />
          <h5>{directoryName}</h5>
        </div>
      );
    });

    this.setState({ galleryCards: directoryCards });
  };

  generateFileCard = (file, type, fileName) => {
    if (type === "image") {
      file.blob().then((value) => {
        this.renderImageCard(value, fileName);
      });
    } else {
      file.blob().then((value) => {
        this.renderVideoCard(value, fileName);
      });
    }
  };

  renderGalleryData = () => {
    const items = this.state.currentItems;
    const firstFileType = items[0];
    if (firstFileType === undefined) {
      return;
    }

    if (firstFileType.includes(".webp") || firstFileType.includes(".mp4")) {
      const callback = this.generateFileCard;
      items.forEach((fileName) => {
        const fileType = fileName.includes(".webp") ? "image" : "video";
        const fileUuid = fileName.replace(".webp", "").replace(".mp4", "");
        GetFile(fileUuid).then((value) => {
          callback(value, fileType, fileUuid);
        });
      });
    } else {
      this.generateDirectoryCards(items);
    }
  };

  handleFileViewerCommand = (action) => {
    let { galleryCards, fileViewer } = this.state;
    const previewFileIndex = galleryCards.findIndex((card) => card.key === fileViewer);
    let nextFile = null;

    if (previewFileIndex === -1) {
      return;
    }

    switch (action) {
      case "previous":
        if (previewFileIndex === 0) {
          return;
        }

        nextFile = galleryCards[previewFileIndex - 1].key;
        break;
      case "next":
        if (previewFileIndex === galleryCards.length - 1) {
          return;
        }

        nextFile = galleryCards[previewFileIndex + 1].key;
        break;
      case "close":
        break;
      default:
        break;
    }

    this.setState({ fileViewer: nextFile, hideVideoView: false });
  };

  onKeyDown = (e) => {
    const supportedKeys = ["ArrowRight", "ArrowLeft", "Escape"];

    if (this.state.fileViewer !== null && supportedKeys.includes(e.key)) {
      switch (e.key) {
        case "ArrowRight":
          this.handleFileViewerCommand("next");
          break;

        case "ArrowLeft":
          this.handleFileViewerCommand("previous");
          break;

        case "Escape":
          this.handleFileViewerCommand("close");
          break;

        default:
          break;
      }
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Galerij" />
        <div className="content">
          <ReactModal showModal={this.state.showModal} title="Item verwijderen" description="Weet je zeker dat je dit item wilt verwijderen?">
            <Button variant="danger" onClick={this.state.modalAction}>
              Verwijderen
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ showModal: false });
              }}
            >
              Annuleren
            </Button>
          </ReactModal>
          <div hidden={this.state.fileViewer !== null}>
            <FileDropper onUploadComplete={() => this.getDirectoryData()} currentDirectory={this.state.currentDirectory} />
          </div>
          <div tabIndex="0" onKeyUp={(e) => this.onKeyDown(e)} id="gallery" className="flex-row">
            {this.state.galleryCards}
          </div>
          <div>{this.state.currentItems.length === 0 ? <EmptyFolder /> : null}</div>
          <div
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            tabIndex="0"
            onKeyUp={(e) => this.onKeyDown(e)}
            hidden={this.state.fileViewer === null}
            id="image-viewer"
          >
            <img hidden={!this.state.hideVideoView} src={this.state.fileViewer} />
            <div hidden={this.state.hideVideoView} className="ehv-card-no-padding">
              <ReactPlayer
                playing={true}
                onError={() => this.setState({ hideVideoView: true })}
                style={{ width: "100%", height: "100%" }}
                className="gallery-video-player"
                url={this.state.fileViewer}
                controls={true}
              />
            </div>
            <span onClick={() => this.setState({ fileViewer: null })} id="gallery-viewer-close">
              &times;
            </span>
          </div>
        </div>
      </div>
    );
  }
}
