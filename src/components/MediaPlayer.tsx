import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: any) => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    if(props.who == "localUser"){
      props.videoTrack?.play("left-video");
      // if(props.name) document.getElementById('left-name')!.innerHTML = props.name;
    }else if(props.who == "remoteUser"){
      props.videoTrack?.play("right-video");
      if(props.name) document.getElementById('right-name')!.innerHTML = props.name.substring(6);
    }
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    if(props.audioTrack){
      props.audioTrack?.play();
    }
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);

  // document.getElementById("left-video")?.innerHTML = '<div ref={container}  className="video-player"}></div>'
  return (
    <div ref={container}  className="video-player" style={{ width: "320px", height: "240px"}}></div>
  );
}

export default MediaPlayer;