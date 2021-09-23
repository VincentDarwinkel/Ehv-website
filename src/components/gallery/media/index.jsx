import "./index.css";

export default function MediaItem(props) {
  const ci = props.data;
  const onMediaItemClick = props.onClick;

  return (
    <div key={ci.uuid} onClick={() => onMediaItemClick(ci.uuid)} className="media-item">
      {ci.fileType === "Image" ? <img src={ci?.previewUrl} /> : <video src={ci?.previewUrl} />}
    </div>
  );
}
