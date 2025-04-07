import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch('./data/DATA.json')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => {
          const fechaA = new Date(a["Fecha de alta"]);
          const fechaB = new Date(b["Fecha de alta"]);

          // Primero por zona, luego por fecha
          const zonaA = a["ZONA"]?.trim() || "";
          const zonaB = b["ZONA"]?.trim() || "";

          if (zonaA !== zonaB) return zonaA.localeCompare(zonaB);
          return fechaA - fechaB;
        });

        setClientes(ordenados);
      })
      .catch(err => console.error('Error cargando JSON:', err));
  }, []);

  return (
    <div className="container">
      <h1>Listado de Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Número</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente["Nombre completo"]}</td>
              <td>{cliente["Correo electrónico"]}</td>
              <td>{cliente["Numero "]}</td>
              <td>{cliente["Grupo de clientes"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
