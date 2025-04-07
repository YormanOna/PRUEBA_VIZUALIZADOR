import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clientes, setClientes] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');

  useEffect(() => {
    fetch('/data/DATA.json') 
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error('Error cargando JSON:', err));
  }, []);


  const zonas = [...new Set(clientes.map(c => c["ZONA"]?.trim()))].sort();

  const clientesFiltrados = zonaSeleccionada
    ? clientes.filter(c => c["ZONA"]?.trim() === zonaSeleccionada)
    : clientes;

  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    const zonaA = a["ZONA"]?.trim() || '';
    const zonaB = b["ZONA"]?.trim() || '';
    const fechaA = new Date(a["Fecha de alta"]);
    const fechaB = new Date(b["Fecha de alta"]);

    if (zonaA !== zonaB) return zonaA.localeCompare(zonaB);
    return fechaA - fechaB;
  });

  return (
    <div className="container">
      <h1>Listado de Clientes</h1>

      <div className="filtros">
        <label>
          Filtrar por Zona:&nbsp;
          <select
            value={zonaSeleccionada}
            onChange={e => setZonaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {zonas.map((zona, i) => (
              <option key={i} value={zona}>{zona}</option>
            ))}
          </select>
        </label>
      </div>

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
          {clientesOrdenados.map((cliente, index) => (
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
