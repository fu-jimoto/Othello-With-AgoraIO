import { Link } from "react-router-dom";
import './home.css'
import { useEffect, useState } from "react";
import Title from "./Title";

const Home = () => {
  const [name, setName] = useState("");
 
  function GameStart(){
    localStorage.setItem("name", document.getElementById('name').value);
  }


  const handleChange = (e) => {
    setName(() => e.target.value);
  }

  useEffect(() => {
    if(name.length == 0){
      document.getElementById('startLink').classList.add('no-click');
      document.getElementById('btbt').classList.add('no-link');
      console.log("add");
    }else{
      document.getElementById('startLink').classList.remove('no-click');
      document.getElementById('btbt').classList.remove('no-link');
      console.log("remove");
    }
    console.log(name);
  }, [name])

  return (
    <>
      <Title />
      <div className="button-area">
        <div className="inline-button">
          <input type="text" id="name" name="playerName" placeholder="name" onChange={handleChange}></input>
          {/* <Link to={`/player`} disabled={joinState} onClick={() => {join()}}> */}
          <Link id="btbt" className="no-link" onClick={GameStart} to={`/player`}>
            <div id="startLink" className="button player-button no-click">
              <p>対戦する</p>
              {/* <input type="text" name="playerName" value="name"></input> */}
            </div>
          </Link>
        </div>
        <div className="inline-button">
            <Link to={`/audience`}>
              <div className="button audience-button">
                <p>観戦する</p>
              </div>
            </Link>
         
        </div>
      </div>
      
    </>
  );
};

export default Home;

// const Test = forwardRef((props, ref) => {
//   useImperativeHandle(ref, () => ({
//     function ChildFunc() =>  {
//       console.log("func");
//     }
//   }))
 
// });

// const Parent = () => {
//   const childCompRef = useRef();
//   return(
//     <>
//       <button onClick={childCompRef.current.test()}>button</button>
//       <Test ref={childCompRef}/>
//     </>
//   )
// }

  
