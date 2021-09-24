import "./index.css";
import Header from "components/shared/header";
import { CreateFolder, GetDirectoryInfo, GetFile, RemoveDirectory, RemoveFile } from "services/gallery";
import React, { useState, useEffect } from "react";
import ReactModal from "components/shared/modal";
import FileDropper from "components/shared/file-dropper";
import Directory from "./directory";
import MediaItem from "./media";
import MediaViewer from "./media-viewer";
import { Pagination, Dropdown, Form } from "react-bootstrap";
import { getFormDataObject, stringIsNullOrEmpty } from "services/shared/form-data-helper";
import { toast } from "react-toastify";

export default function Gallery() {
  const [currentDirectory, setCurrentDirectory] = useState("/Media/Public/Gallery");
  const [currentItems, setCurrentItems] = useState([]);
  const [mediaViewerData, setMediaViewerData] = useState({
    hidden: true,
    currentItemsIndex: -1,
    currentItems,
  });

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [modalOptions, setModalOptions] = useState({
    description: null,
    show: false,
    callback: () => null,
    close: () => {
      let options = modalOptions;
      options.show = false;
      setModalOptions(options);
      forceUpdate();
    },
  });

  useEffect(() => {
    getDirectoryData();
  }, []);

  const getDirectoryData = async (directory = null) => {
    if (directory !== null) {
      sessionStorage.setItem("currentDir", directory);
      setCurrentDirectory(directory);
    }

    const directoryInfoResponse = await GetDirectoryInfo(stringIsNullOrEmpty(directory) ? currentDirectory : directory);
    if (directoryInfoResponse.status === 200) {
      const directoryInfo = await directoryInfoResponse.json();
      setCurrentItems(directoryInfo);

      if (!directoryInfo[0]?.isDirectory) {
        const callback = generateFilePreviewUrl;
        directoryInfo.forEach((di) => {
          GetFile(di.uuid).then((value) => {
            if (directory !== sessionStorage.getItem("currentDir")) {
              return;
            }
            callback(value, di, directoryInfo, directory);
          });
        });
      }
    }
  };

  const generateFilePreviewUrl = (file, fileInfo, directoryInfo, currentDir) => {
    file.blob().then((value) => renderPreviewUrl(value, fileInfo, directoryInfo, currentDir));
  };

  const renderPreviewUrl = async (file, fileInfo, directoryInfo, currentDir) => {
    let url = null;
    if (fileInfo.fileType === "Video") {
      const buf = await file.arrayBuffer();
      url = URL.createObjectURL(new Blob([buf]));
    } else {
      url = URL.createObjectURL(file);
    }

    let items = directoryInfo;
    const index = items.findIndex((i) => i.uuid === fileInfo.uuid);
    if (index === -1) {
      return;
    }

    items[index].previewUrl = url;
    setCurrentItems(items);
    forceUpdate();
  };

  const removeItem = (uuid) => {
    let items = currentItems;
    const index = items.findIndex((i) => i.uuid === uuid);
    if (index === -1) {
      return;
    }

    const itemToRemove = items[index];
    itemToRemove?.isDirectory ? RemoveDirectory(itemToRemove.uuid) : RemoveFile(itemToRemove.uuid);

    items.splice(index, 1);
    setCurrentItems(items);
    forceUpdate();
  };

  const onMediaItemClick = (uuid) => {
    const index = currentItems.findIndex((ci) => ci.uuid === uuid);
    if (index === -1) {
      return;
    }

    setMediaViewerData({
      hidden: false,
      currentItems,
      currentItemsIndex: index,
    });
  };

  const createFolder = async (e) => {
    e.preventDefault();
    if (!currentItems.every((ci) => ci.isDirectory)) {
      toast.error("Mappen kunnen niet worden aangemaakt als er bestanden aanwezig zijn");
      return;
    }

    const formData = getFormDataObject(e);
    const path = `${currentDirectory}/${formData.folderName}`;
    const result = await CreateFolder(path);
    if (result.status === 200) {
      getDirectoryData();
    }
  };

  const canUploadFilesInDirectory = () =>
    currentItems.length === 0 || (!currentItems.every((ci) => ci.isDirectory) && currentDirectory !== "/Media/Public/Gallery");
  const canCreateFoldersInDirectory = () => currentItems.length === 0 || currentItems.every((ci) => ci.isDirectory);

  return (
    <div>
      <Header pageName="Galerij" />
      <ReactModal modalOptions={modalOptions} />
      <div className="content">
        <div id="gallery">
          <div id="gallery-options">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <i className="fas fa-plus" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {canUploadFilesInDirectory() ? (
                  <div className="dropdown-item">
                    <FileDropper onFinished={(path) => getDirectoryData(path)} currentDirectory={currentDirectory} />
                  </div>
                ) : null}
                {canCreateFoldersInDirectory() ? (
                  <Form onSubmit={createFolder} className="dropdown-item">
                    <i className="fas fa-folder-plus" /> Nieuwe map
                    <input name="folderName" placeholder="Mapnaam" />
                  </Form>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
            <hr />
            <br />
            <Pagination size="sm">
              <Pagination.Item onClick={() => getDirectoryData("/Media/Public/Gallery")}>Home</Pagination.Item>
              {currentDirectory
                .replace("/Media/Public/Gallery", "")
                .split("/")
                .map((dir) => (!stringIsNullOrEmpty(dir) ? <Pagination.Item>{dir}</Pagination.Item> : null))}
            </Pagination>
          </div>
          {currentItems[0]?.isDirectory ? (
            currentItems.map((ci) => (
              <Directory
                key={ci.uuid}
                forceUpdate={forceUpdate}
                modalOptions={modalOptions}
                setModalOptions={setModalOptions}
                currentDirectory={currentDirectory}
                setCurrentItems={setCurrentItems}
                onClick={getDirectoryData}
                currentItems={currentItems}
                data={ci}
                removeItem={removeItem}
              />
            ))
          ) : (
            <div id="gallery-media" className="row">
              {currentItems.map((ci) => (
                <MediaItem
                  key={ci.uuid}
                  forceUpdate={forceUpdate}
                  modalOptions={modalOptions}
                  setModalOptions={setModalOptions}
                  currentDirectory={currentDirectory}
                  onClick={onMediaItemClick}
                  currentItems={currentItems}
                  data={ci}
                />
              ))}
            </div>
          )}
        </div>
        <MediaViewer
          removeItem={removeItem}
          setModalOptions={setModalOptions}
          modalOptions={modalOptions}
          forceUpdate={forceUpdate}
          mediaViewerData={mediaViewerData}
          setMediaViewerData={setMediaViewerData}
        />
      </div>
    </div>
  );
}
