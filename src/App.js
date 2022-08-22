import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Common/Home";
import Player from "./Player/Player";
import Audience from "./Audience/Audience";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/player/`} element={<Player />} />
          <Route path={`/audience/`} element={<Audience />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
