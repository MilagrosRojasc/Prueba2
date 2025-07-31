import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Opcional para estilos

function Home({ setIsAuthenticated }) {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleVerResultados = () => {
    navigate("/resultados");
  };

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      navigate("/atletas"); // Puedes llevarlo a otra ruta si prefieres
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className="home-container">
      <h2></h2>

      {!mostrarLogin ? (
        <div className="home-botones">
          <button onClick={handleVerResultados}>Ver Leaderboard</button>
          <button onClick={() => setMostrarLogin(true)}>Editar Scores</button>
        </div>
      ) : (
        <div className="home-login">
          <input
            type="password"
            placeholder="Contraseña de administrador"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Ingresar</button>
          <button onClick={() => setMostrarLogin(false)}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default Home;
