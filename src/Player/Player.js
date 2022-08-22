// import './App.css';
import Title from "../Common/Title"
import Video from "../Common/Video";
import Stage from "../Common/Stage";
import Chat from "../Common/Chat";
import Footer from "./Footer"
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "../useAgora";
import MediaPlayer from "../components/MediaPlayer";
import { Link } from "react-router-dom";
import { createContext, useEffect } from "react";

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

function Player() {
  const {
    localVideoTrack, leave, join, joinState, remoteUsers, sendMessage, sendPlaceOthelloPieces
  } = useAgora(client);

  //Chat.js内のhandleAddを受け取りuseAgoraの関数を実行
  function sendChat(event){
    event.preventDefault();
    if(!document.getElementById('messageForm').value == ""){
      sendMessage();
    }
  }

  function placeOthello(i){
    sendPlaceOthelloPieces(i);
  }

  useEffect(() => {
    
  }, [])

  // window.addEventListener("DOMContentLoaded", function(){
      // document.getElementById("retireButton").addEventListener("click", window.confirm("投了して退出します"));
  // })

  // const switchConcentration = () => {
  //   setConcentration(!concentration);
  //   const boadClass = document.getElementById("stage").classList;
  //   if (boadClass.contains("concentration-boad")){
  //     boadClass.remove("concentration-boad");
  //   }else{
  //     boadClass.add("concentration-boad");
  //   }
  // }

  return ( 
    <>
      <div className="main">
        <Title />
        <Video />
        <Stage handleAdd={placeOthello} />
        <Chat handleAdd={sendChat} />
        <div id="retire">
          
        </div>
      </div>
      <div className='button-group'>
        <button id='join' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={join}>Join</button>
        <Link to={`/`} id="retireButton" onClick={() => {leave()}}><p>投了</p></Link>      </div>

      <div className='player-container'>
        <div className='local-player-wrapper'>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined} who="localUser" name={client.uid}></MediaPlayer>
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack} who="remoteUser" name={user.uid}></MediaPlayer>
          </div>))}
      </div>
      <Footer />
    
      {/* <button onClick={switchConcentration}>
        {concentration ? "全体視野モードへ" : "集中モードへ"}
      </button>  */}
    </>
  );
}

export default Player;
