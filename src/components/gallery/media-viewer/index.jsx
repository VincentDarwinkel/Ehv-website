import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./index.css";

export default function MediaViewer(props) {
  const data = props?.mediaViewerData;
  const setMediaViewerData = props.setMediaViewerData;
  const forceUpdate = props.forceUpdate;
  const [xDown, setXdown] = useState();
  const [yDown, setYdown] = useState();
  const modalOptions = props.modalOptions;
  const setModalOptions = props.setModalOptions;
  const removeItem = props.removeItem;

  const onKeyDown = (e) => {
    const supportedKeys = ["ArrowRight", "ArrowLeft", "Escape"];
    if (supportedKeys.includes(e.key)) {
      switch (e.key) {
        case "ArrowRight":
          renderNextItem();
          break;

        case "ArrowLeft":
          renderPreviousItem();
          break;

        case "Escape":
          close();
          break;

        default:
          break;
      }
    }
  };

  const renderNextItem = () => {
    let mvData = data;
    if (mvData.currentItemsIndex + 1 >= mvData.currentItems.length) {
      return;
    }

    mvData.currentItemsIndex++;
    setMediaViewerData(mvData);
    forceUpdate();
  };

  const renderPreviousItem = () => {
    let mvData = data;
    if (mvData.currentItemsIndex - 1 < 0) {
      return;
    }

    mvData.currentItemsIndex--;
    setMediaViewerData(mvData);
    forceUpdate();
  };

  const getTouches = (evt) => {
    return evt.touches || evt.originalEvent.touches;
  };

  const handleTouchStart = (evt) => {
    const firstTouch = getTouches(evt)[0];
    setXdown(firstTouch.clientX);
    setYdown(firstTouch.clientY);
  };

  const handleTouchMove = (evt) => {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        renderNextItem();
      } else {
        renderPreviousItem();
      }
    } else {
      close();
    }

    setXdown(null);
    setYdown(null);
  };

  const close = () => {
    let mvData = data;
    mvData.currentItemsIndex = -1;
    mvData.hidden = true;
    setMediaViewerData(mvData);
    forceUpdate();
  };

  useEffect(() => {
    document.getElementById("media-viewer").focus();
  }, [data.hidden, data.currentItemsIndex]);

  const currentItem = data?.currentItems[data?.currentItemsIndex];

  return (
    <div
      id="media-viewer"
      hidden={data?.hidden}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      tabIndex="0"
      onKeyUp={(e) => onKeyDown(e)}
    >
      <button onClick={close} className="link-btn" id="media-viewer-close-btn">
        &#10005;
      </button>
      <div id="media-viewer-preview-wrapper">
        {data.currentItemsIndex !== -1 ? (
          currentItem.fileType === "Image" ? (
            <img src={currentItem?.previewUrl} />
          ) : (
            <ReactPlayer className="gallery-video-wrapper" controls url={currentItem?.previewUrl} />
          )
        ) : null}
      </div>
      <div id="media-item-btn-wrapper">
        <i className="fas fa-chevron-circle-left" onClick={() => renderPreviousItem()} />
        {data.currentItems[data.currentItemsIndex]?.requestingUserIsOwner ? (
          <i
            onClick={() => {
              let mOptions = modalOptions;
              mOptions.callback = () => removeItem(currentItem.uuid);
              mOptions.show = true;
              mOptions.description = "Weet je zeker dat je dit item wilt verwijderen?";
              setModalOptions(mOptions);
              forceUpdate();
            }}
            id="delete-media-item-btn"
            className="fas fa-trash link-btn"
          />
        ) : null}
        <i className="fas fa-chevron-circle-right" onClick={() => renderNextItem()} />
      </div>
    </div>
  );
}
