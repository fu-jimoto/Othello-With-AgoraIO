import "../Common/footer.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCommentSlash, faComment} from "@fortawesome/free-solid-svg-icons";


function Footer() {
    const [comment, setComment] = useState(false);
  
    const switchComment = () => {
      setComment(!comment);
      const chat = document.getElementById("chat");
      if (chat.style.display === "block"){
        chat.style.display = "none";
      }else{
        chat.style.display = "block";
      }
    }

  return (
    <div id="footer">
      <div className="audience-num">
        <p>観戦　10人</p>
      </div>
      <div className="predict">
        <p>勝者予想投票</p>
        <div className="graff"></div>
      </div>
      <div className="switch-button">
        <button onClick={switchComment}>
          <FontAwesomeIcon icon={comment ? faCommentSlash : faComment} />
        </button>
      </div>
    </div>
  )
}

export default Footer;