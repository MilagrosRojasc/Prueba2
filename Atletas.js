import { useState } from 'react';

function App() {
  const [atleta, setAtleta] = useState('');
  const [atletas, setAtletas] = useState([]);

  const agregarAtleta = () => {
    if (atleta.trim() !== '') {
      setAtletas([...atletas, { nombre: atleta }]);
      setAtleta('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏋️‍♀️ Lista de Atletas</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre del atleta"
          value={atleta}
          onChange={(e) => setAtleta(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={agregarAtleta}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
        >
          Agregar
        </button>
      </div>

      <ul className="list-disc pl-5">
        {atletas.map((a, i) => (
          <li key={i} className="text-lg">{a.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
