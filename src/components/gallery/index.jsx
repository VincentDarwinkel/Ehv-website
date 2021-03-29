import React, { Component } from "react";
import "./index.css";
import Header from "components/shared/header";
import FileDropper from "components/shared/file-dropper";
import { GetFile, GetFileNamesFromDirectory } from "services/gallery";
import ReactPlayer from "react-player";
export default class Gallery extends Component {
  constructor() {
    super();
    this.state = {
      currentDirectory: "/public/gallery/",
      currentItems: [],
      galleryCards: [],
    };
  }

  componentDidMount = () => {
    this.getDirectoryData();
  };

  getDirectoryData = async () => {
    const response = await GetFileNamesFromDirectory(this.state.currentDirectory);
    if (response.status === 200) {
      const items = await response.json();
      this.setState({ currentItems: items }, this.renderGalleryData);
    }
  };

  generateImageCards = (images) => {
    let cards = [];
    images.forEach((image) => {
      cards.push(
        <div className="ehv-card">
          <img src={URL.createObjectURL(image)} />
        </div>
      );
    });

    return cards;
  };

  generateVideoCards = (videos) => {
    let cards = [];
    videos.forEach((video) => {
      const url = URL.createObjectURL(video);
      cards.push(<ReactPlayer url={url} width="100%" height="100%" controls={true} />);
    });

    return cards;
  };

  onDirectoryCardClick = (directoryName) => {
    const currentDirectory = `${this.state.currentDirectory}${directoryName}/`;
    this.setState({ currentDirectory }, this.getDirectoryData);
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

  generateFileCards = (files) => {
    const images = files?.filter((item) => item.type.includes("image/webp"));
    const videos = files?.filter((item) => item.type.includes("video/mp4"));

    const imageCards = this.generateImageCards(images);
    const videoCards = this.generateVideoCards(videos);

    const galleryCards = imageCards.concat(videoCards);
    this.setState({ galleryCards });
  };

  renderGalleryData = async () => {
    const items = this.state.currentItems;
    const firstFileType = items[0];

    if (firstFileType.includes(".webp") || firstFileType.includes(".mp4")) {
      let filePromises = [];
      items.forEach((fileName) => {
        const fileUuid = fileName.replace(".webp", "").replace(".mp4", "");
        const filePromise = GetFile(fileUuid);
        filePromises.push(filePromise);
      });

      const fileResponses = await Promise.all(filePromises); // wait for all promises to resolve
      let jsonPromises = [];

      fileResponses.forEach((response) => {
        const file = response.blob();
        jsonPromises.push(file);
      });

      const files = await Promise.all(jsonPromises); // wait for all promises to resolve
      this.generateFileCards(files);
    } else {
      this.generateDirectoryCards(items);
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Galerij" />
        <div className="content">
          <FileDropper />
          <div id="gallery">{this.state.galleryCards}</div>
        </div>
      </div>
    );
  }
}
