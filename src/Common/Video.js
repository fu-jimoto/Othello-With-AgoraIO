import "./video.css";

function Video() {
  return (
    <div id="video">
      <div className="video-area left-area">
        <div id="left-video" className="video-area"></div>
        <div id="left-name" className="name"></div>
      </div>
      <div className="video-area right-area">
        <div id="right-video" className="video-area"></div>
        <div id="right-name" className="name"></div>
      </div>
    </div>
    
  )
}

export default Video;