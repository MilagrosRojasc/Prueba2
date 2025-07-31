import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Atletas from "./components/Atletas";
import Wods from "./components/Wods";
import Leaderboard from "./components/Leaderboard";
import Resultados from "./Resultados";

function App() {
  const [atletas, setAtletas] = useState(() => {
    const saved = localStorage.getItem("atletas");
    return saved ? JSON.parse(saved) : [];
  });

  const [wods, setWods] = useState(() => {
    const saved = localStorage.getItem("wods");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem("leaderboard");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [resultados, setResultados] = useState(() => {
    const saved = localStorage.getItem("resultados");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("atletas", JSON.stringify(atletas));
  }, [atletas]);

  useEffect(() => {
    localStorage.setItem("wods", JSON.stringify(wods));
  }, [wods]);

  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem("resultados", JSON.stringify(resultados));
  }, [resultados]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Leaderboard
              atletas={atletas}
              wods={wods}
              leaderboard={leaderboard}
              resultados={resultados}
            />
          }
        />
        <Route
          path="/resultados"
          element={
            <Resultados
              atletas={atletas}
              wods={wods}
              resultados={resultados}
              setResultados={setResultados}
            />
          }
        />
        <Route
          path="/atletas"
          element={<Atletas atletas={atletas} setAtletas={setAtletas} />}
        />
        <Route
          path="/wods"
          element={<Wods wods={wods} setWods={setWods} />}
        />
        <Route 
        path="/leaderboard"
        element={
        <Leaderboard 
        atletas={atletas} 
        wods={wods} 
        resultados={resultados}
        setResultados={setResultados} />}
/>
      </Routes>
    </Router>
  );
}

export default App;