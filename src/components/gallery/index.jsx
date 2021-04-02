import React, { Component } from "react";
import "./index.css";
import Header from "components/shared/header";
import FileDropper from "components/shared/file-dropper";
import { GetFile, GetFileNamesFromDirectory, GetDirectoryInfo, RemoveFile, RemoveDirectory } from "services/gallery";
import ReactPlayer from "react-player";
import { Button, Dropdown } from "react-bootstrap";
import ReactModal from "components/shared/modal";
import EmptyFolder from "components/shared/empty-folder";
import DirectoryCreator from "components/shared/directory-creator";

export default class Gallery extends Component {
  constructor() {
    super();
    this.state = {
      currentDirectory: "/public/gallery/",
      currentItems: [],
      galleryCards: [],
      filesOwnedByUser: [],
      foldersOwnedByUser: [],
      fileViewer: null,
      hideVideoView: true,
      xDown: null,
      yDown: null,
      showModal: false,
      modalAction: null,
      showedOption: null,
      directoryContainsFile: false,
      directoryContainsFolder: false,
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
    this.setState({ directoryContainsFile: false, directoryContainsFolder: false });

    const filesResponse = await GetFileNamesFromDirectory(this.state.currentDirectory);
    const directoryInfoResponse = await GetDirectoryInfo(this.state.currentDirectory);

    if (filesResponse.status === 200 || directoryInfoResponse.status === 200) {
      const items = await filesResponse.json();
      const directoryInfo = await directoryInfoResponse.json();

      const uuid = "091f31ae-a4e5-41b1-bb86-48dbfe40b839"; // TODO remove this temp variable
      this.setState(
        {
          currentItems: items,
          filesOwnedByUser: directoryInfo?.filesOwnedByUser,
          foldersOwnedByUser: directoryInfo?.directoryContentInfo?.find((dci) => dci.ownerUuid === uuid)?.directoriesOwnedByUser,
        },
        this.renderGalleryData
      );
    }
  };

  renderImageCard = (image, fileUuid) => {
    let { galleryCards } = this.state;
    const url = URL.createObjectURL(image);
    galleryCards.push(
      <div key={url} className="ehv-card-no-padding">
        <img alt="gallery" onClick={() => this.setState({ fileViewer: url })} src={url} />
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

  onDirectoryRemove = async (directoryName) => {
    const result = await RemoveDirectory(this.state.currentDirectory + directoryName);
    if (result.status === 200) {
      let { currentItems, galleryCards } = this.state;
      currentItems = currentItems.filter((ci) => ci !== directoryName);
      galleryCards = galleryCards.filter((gc) => gc.key !== directoryName);

      this.setState({ currentItems, galleryCards });
    }
  };

  generateDirectoryCards = (directories) => {
    this.setState({ directoryContainsFolder: true });
    let directoryCards = [];
    directories.forEach((directoryName) => {
      directoryCards.push(
        <div key={directoryName}>
          <div onClick={() => this.onDirectoryCardClick(directoryName)} className="ehv-card directory-card">
            <i className="fas fa-folder" />
            <h5>{directoryName}</h5>
          </div>
          {this.state.foldersOwnedByUser?.some((folderName) => folderName === directoryName) ? (
            <Button onClick={() => this.onDirectoryRemove(directoryName)} block>
              Verwijderen
            </Button>
          ) : null}
        </div>
      );
    });

    this.setState({ galleryCards: directoryCards });
  };

  generateFileCard = (file, type, fileName) => {
    let { directoryContainsFile } = this.props;
    if (!directoryContainsFile) {
      directoryContainsFile = true;
      this.setState({ directoryContainsFile });
    }

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

  loadPreviousDirectory = () => {
    let { currentDirectory } = this.state;
    const folders = currentDirectory.split("/").filter((f) => f !== "");
    currentDirectory = currentDirectory.replace(`${folders[folders.length - 1]}/`, "");

    this.setState({ currentDirectory }, this.getDirectoryData);
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
          <div id="gallery-options" className="mb-2" hidden={this.state.fileViewer !== null}>
            <Dropdown>
              <Dropdown.Toggle variant="primary">
                Acties <li className="fas fa-pen" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {this.state.showedOption !== null ? (
                  <Dropdown.Item onClick={() => this.setState({ showedOption: null })}>
                    <i className="far fa-eye-slash" /> Opties verbergen
                  </Dropdown.Item>
                ) : null}

                {!this.state.directoryContainsFolder ? (
                  <Dropdown.Item onClick={() => this.setState({ showedOption: "fileDropper" })}>
                    <i className="fas fa-photo-video" /> Bestanden uploaden
                  </Dropdown.Item>
                ) : null}

                {!this.state.directoryContainsFile ? (
                  <Dropdown.Item onClick={() => this.setState({ showedOption: "directoryCreator" })}>
                    <i className="fas fa-folder-plus" /> Map aanmaken
                  </Dropdown.Item>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
            <br />
            <Button onClick={this.loadPreviousDirectory} disabled={this.state.currentDirectory === "/public/gallery/"}>
              <i className="fas fa-arrow-left" />
            </Button>
          </div>
          <FileDropper
            hidden={this.state.showedOption !== "fileDropper"}
            onUploadComplete={() => this.getDirectoryData()}
            currentDirectory={this.state.currentDirectory}
          />
          <DirectoryCreator
            callback={() => this.getDirectoryData()}
            currentDirectory={this.state.currentDirectory}
            hidden={this.state.showedOption !== "directoryCreator" || this.state.directoryContainsFile}
          />
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
            <img alt="preview" hidden={!this.state.hideVideoView} src={this.state.fileViewer} />
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
