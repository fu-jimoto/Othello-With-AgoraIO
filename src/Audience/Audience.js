// import './App.css';
import React, { useState } from "react";
import Title from "../Common/Title"
import Video from "../Common/Video";
import Stage from "../Common/Stage"
import Chat from "../Common/Chat"
import Footer from "./Footer"

function Audience() {

  return (
    <>
      <div className="main">
        <Title />
        <Video />
        <Stage />
        <Chat />
      </div>
      <Footer />
    </>
  );
}

export default Audience;
