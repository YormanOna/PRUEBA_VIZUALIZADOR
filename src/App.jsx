import { useEffect, useState, useMemo, useCallback } from 'react';
import './App.css';

function App() {
  const ITEMS_POR_PAGINA = 25;
  
  const [clientes, setClientes] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos y manejar errores con feedback
  useEffect(() => {
    fetch('/data/DATA.json')
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error cargando JSON:', err);
        setError('Error cargando datos. Intenta más tarde.');
        setIsLoading(false);
      });
  }, []);

  // Memorizar la lista de zonas para evitar cálculos innecesarios
  const zonas = useMemo(() => {
    return [...new Set(clientes.map(c => c["ZONA"]?.trim()))].sort();
  }, [clientes]);

  // Filtrado por zona y búsqueda en tiempo real (por nombre o correo)
  const clientesFiltrados = useMemo(() => {
    let filtrados = zonaSeleccionada
      ? clientes.filter(c => c["ZONA"]?.trim() === zonaSeleccionada)
      : clientes;
    if (busqueda.trim() !== '') {
      filtrados = filtrados.filter(cliente =>
        cliente["Nombre completo"]?.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente["Correo electrónico"]?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    return filtrados;
  }, [clientes, zonaSeleccionada, busqueda]);

  // Ordenar primero por zona y luego por fecha de alta
  const clientesOrdenados = useMemo(() => {
    return [...clientesFiltrados].sort((a, b) => {
      const zonaA = a["ZONA"]?.trim() || '';
      const zonaB = b["ZONA"]?.trim() || '';
      const fechaA = new Date(a["Fecha de alta"]);
      const fechaB = new Date(b["Fecha de alta"]);
      if (zonaA !== zonaB) return zonaA.localeCompare(zonaB);
      return fechaA - fechaB;
    });
  }, [clientesFiltrados]);

  // Paginación de los resultados
  const totalPaginas = Math.ceil(clientesOrdenados.length / ITEMS_POR_PAGINA);
  const clientesPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return clientesOrdenados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [clientesOrdenados, paginaActual]);

  // Callbacks para evitar recreaciones en cada render
  const handleZonaChange = useCallback((zona) => {
    setZonaSeleccionada(zona);
    setPaginaActual(1);
  }, []);

  const handleBusquedaChange = useCallback((e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  }, []);

  const handlePaginaAnterior = useCallback(() => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  }, []);

  const handlePaginaSiguiente = useCallback(() => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  }, [totalPaginas]);

  return (
    <div className="container">
      <h1>Listado de Clientes</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">Cargando datos...</div>
      ) : error ? (
        <div role="alert" className="error">{error}</div>
      ) : (
        <>
          <div className="filtros">
            <label htmlFor="zona-select">
              Filtrar por Zona:&nbsp;
              <select
                id="zona-select"
                value={zonaSeleccionada}
                onChange={e => handleZonaChange(e.target.value)}
              >
                <option value="">Todas</option>
                {zonas.map((zona, i) => (
                  <option key={i} value={zona}>{zona}</option>
                ))}
              </select>
            </label>
            &nbsp;&nbsp;
            <label htmlFor="search-input">
              Buscar:&nbsp;
              <input
                id="search-input"
                type="text"
                value={busqueda}
                onChange={handleBusquedaChange}
                placeholder="Nombre o correo"
              />
            </label>
          </div>

          {/* Controles de paginación */}
          <div className="paginacion">
            <button
              onClick={handlePaginaAnterior}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={handlePaginaSiguiente}
              disabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>

          <br />

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Número</th>
                <th>Grupo</th>
                <th>Zona</th>
              </tr>
            </thead>
            <tbody>
              {clientesPagina.length > 0 ? (
                clientesPagina.map((cliente, index) => (
                  <tr key={index}>
                    <td>{cliente["Nombre completo"]}</td>
                    <td>{cliente["Correo electrónico"]}</td>
                    <td>{cliente["Numero "]}</td>
                    <td>{cliente["Grupo de clientes"]}</td>
                    <td>{cliente["ZONA"]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" role="alert">No se encontraron clientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
