import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Atletas from "./components/Atletas";
import Wods from "./components/Wods";
import Leaderboard from "./components/Leaderboard";
import Resultados from "./Resultados";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Página de inicio pública */}
        <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />

        {/* Resultados públicos */}
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

        {/* Rutas privadas */}
        <Route
          path="/atletas"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Atletas atletas={atletas} setAtletas={setAtletas} />
            </PrivateRoute>
          }
        />
        <Route
          path="/wods"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Wods wods={wods} setWods={setWods} />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Leaderboard
                atletas={atletas}
                wods={wods}
                resultados={resultados}
                setResultados={setResultados}
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
