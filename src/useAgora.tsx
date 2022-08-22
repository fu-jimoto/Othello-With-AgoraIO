import React, { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient, IAgoraRTCRemoteUser, MicrophoneAudioTrackInitConfig, CameraVideoTrackInitConfig, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RtmChannel, RtmClient} from 'agora-rtm-sdk';
import { event } from 'jquery';
// import { onClickSquare } from './Common/othelloFunc';
import { onClickSquare, changeColor } from './Common/Stage';

const appId = YOUR APP ID;
const channel = "testChannel";
var uid: string = "";

const myRtmClient: RtmClient = AgoraRTM.createInstance(appId);
const myRtmChannel: RtmChannel = myRtmClient.createChannel(channel);

function useAgora(client: IAgoraRTCClient | undefined)
  :
   {
      localAudioTrack: ILocalAudioTrack | undefined,
      localVideoTrack: ILocalVideoTrack | undefined,
      joinState: boolean,
      leave: Function,
      join: Function,
      remoteUsers: IAgoraRTCRemoteUser[],
      sendMessage: Function,
      sendPlaceOthelloPieces: Function
    }
    {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  async function createLocalTracks(audioConfig?: MicrophoneAudioTrackInitConfig, videoConfig?: CameraVideoTrackInitConfig)
  : Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join() {
    //もし参戦者側だったら
    if(localStorage.getItem("name")){
      await joinRtc();
      joinRtm();
    }
    console.log("join() finished");
  }

  async function joinRtc(){
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    uid = "player" + localStorage.getItem("name")!;
    
    await client.join(appId, channel, null, uid);
    await client.publish([microphoneTrack, cameraTrack]);

    (window as any).client = client;
    (window as any).videoTrack = cameraTrack;

    if(uid.indexOf('player') === 0){
      document.getElementById('left-name')!.innerHTML = uid.substring(6);
    }

    setJoinState(true);
  }

  async function leave() {
    // window.confirm("投了して退出します");
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
    logoutRtm();
  }

  

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);


  //チャット機能の為rtm導入

  // const [rtmClient, setRtmClient] = useState<RtmClient>();
  // const [rtmChannel, setRtmChannel] = useState<RtmChannel>();
  // const [rtmMessage, setRtmMessage] = useState<RtmMessage | undefined>(undefined);
  // const [rtmTextMessage, setRtmTextMessage] = useState<RtmTextMessage | undefined>(undefined);

  // let rtm: {myRtmClient: RtmClient, myRtmChannel: RtmChannel};

  // const kariRtmClient: RtmClient =  AgoraRTM.createInstance(appId);

  // rtm = {
  //   myRtmClient: kariRtmClient,
  //   myRtmChannel: kariRtmClient.createChannel(channel)
  // }



  function joinRtm(){
    // setRtmClient(AgoraRTM.createInstance(appId));
    // setRtmChannel(rtmClient?.createChannel(channel));

    myRtmClient.on("ConnectionStateChanged", (newState, reason) => {
      console.log("on connection state changed to " + newState + " reason:" + reason);
    });
    myRtmChannel.on('MemberLeft', memberId => {
      alert("対戦相手が退出しました");
      leave();
    })
    
    //Log in the Agora RTM system
    myRtmClient.login({uid: "" + client?.uid}).then(function(){
      console.log("AgoraRTM client login success");
      myRtmChannel.join().then(function(){
        console.log("AgoraRTM client join success");
        myRtmChannel.getMembers().then(function(uidList){
          setRole(uidList);
        })
        receiveChannelMessage();
      }).catch(function (err){
        console.log("AgoraRTM client join failure, ", err);
      });
    }).catch(function(err){
      console.log("AgoraRTM client login failure, ", err);
    });
  }

  //チャンネルメッセージの送信
  function sendMessage(){
  
    var form = document.getElementById("messageForm") as HTMLInputElement;
    var message = form.value;

    myRtmChannel.sendMessage({ text: message }).then(() => {
      console.log("sendMessage");
      console.log("::164::")
      addMessageList("あなた : " + message);
      form.value = "";
    }).catch(error => {
      console.log("errorだよ:" + error);
    })
    console.log("::169::");
  }

  function setRole(uidList: string[]){
    var playerCount = 0;
    console.log(uidList);
    uidList.forEach(uid => {
      if(uid.indexOf("player") === 0){
        playerCount += 1;
      }
    })
    if (playerCount == 2){
      localStorage.setItem("role", "白");
      document.getElementById('right-name')!.style.border = "1px solid red";

    }else{
      localStorage.setItem("role", "黒");
      document.getElementById('left-name')!.style.border = "1px solid red";

    }
  }
  //オセロの駒をどこに置いたかを伝え、盤面を相手に同期させる
  function sendPlaceOthelloPieces(index: number){
    myRtmChannel.sendMessage({ text: `placeOthelloPiece:${index}` }).then(() => {
      console.log("sendPlaceOthelloPieces(" + index + ")");
    }).catch(error => {
      console.log("errorだよ:" + error);
    }) 
  }

  function receiveChannelMessage(){

    myRtmChannel.on("ChannelMessage", function (sentMessage, senderId) {
      var message: string = JSON.parse(JSON.stringify(sentMessage)).text;
      if(message.indexOf("placeOthelloPiece:") === 0){
        placeOpponentOthelloPiece(message);
      }else{
        console.log("メッセージ取得");
        console.log("メッセージ受信: " + JSON.stringify(sentMessage) + " from " + senderId);
        addMessageList(message);
      }
    })
  }

  function addMessageList(message: string){
    var comment_element = document.createElement('li');
    comment_element.textContent = message;
    document.getElementById("comments")!.appendChild(comment_element);
  }

  //相手の打ち手を自分の画面で反映させる
  function placeOpponentOthelloPiece(message: string){
    console.log("197:" + message);
    var placeNum: number = Number(message.substring(18));
    console.log(placeNum);
    onClickSquare(placeNum);
    // changeColor();
  }

  // function setLocalStrage(){
  //   const membersCount = myRtmChannel.getMembers;
  //   console.log(membersCount);
  //   console.log(membersCount.length);
  // }

  function logoutRtm(){
    myRtmClient.logout().then(function(){
      console.log("Rtmがログアウトしたよ");
    }).catch(function(error){
      console.log("Rtmのログアウトに失敗:" + error);
    })
    // window.location.reload();
    console.log("window.location.host:" + window.location.host);
    window.location.href = "/"
  }
  

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    sendMessage,
    sendPlaceOthelloPieces
  };
}

export default useAgora;