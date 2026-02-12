import React, { useState, useEffect } from 'react';
import './Inicio.css';
import Sidebar from './Sidebar';

function Inicio(props) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = "https://api.steinhq.com/v1/storages/67a7cdaac08833336571d45a";
  const sheetName = "Inicio"; // Nombre de la hoja donde guardas estos datos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/${sheetName}`);
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setData(result[0]); // Suponiendo que solo hay una fila con los datos
        } else {
          console.error("Datos no válidos:", result);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const goToGoogleSheets = () => {
    window.open("https://docs.google.com/spreadsheets/d/11968Yq2O9I9VH2vr46gB-r1wvUAoR6EqoLSgTx0oRrs/edit?gid=119171419#gid=119171419", "_blank");  
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!data) {
    return <p>Error: No se pudieron cargar los datos.</p>;
  }

  return (
    <div className="Inicio">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <div id="Titulo">
          <br />
          <br />
          <h1>Congregación Este Villa Bosch</h1>
        </div>

        <div id="Texto">
          <br />
          <br />
          <h2>({data.Versiculo})</h2>
          <h2>"{data.Cita}"</h2>
          <br />
          <br />
        </div>

        <footer>
          <div id="Horarios">
            <br />
            <h6>{data.TituloHorarios}</h6>
            <br />
            <h6>{data.Dia1}</h6>
            <h6>{data.Dia2}</h6>
            <br />
          </div>
          {props.usuario && (
          <>
          <button className="ver-formulario-btn" onClick={goToGoogleSheets}>
            Ver formulario
          </button>
          </>
        )}
        </footer>
      </div>
    </div>
  );
}

export default Inicio;