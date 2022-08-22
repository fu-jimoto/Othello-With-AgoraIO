import "./chat.css";

function Chat({handleAdd}){

  return(
    <div id="chat">
      <ul id="comments"></ul>
      <form id="messageArea" onSubmit={handleAdd}>
        <input typeof="text" id="messageForm"></input>
      </form>
    </div>
  )
}

export default Chat;