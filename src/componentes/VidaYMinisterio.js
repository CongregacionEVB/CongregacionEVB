import './VidaYMinisterio.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

function VidaYMinisterio(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consultamos la tabla unificada, ordenamos por fecha y limitamos a 2 resultados
        const { data: list, error } = await supabase
          .from('VidaYMinisterio')
          .select('*')
          .order('timeStamp', { ascending: false })
          .limit(2);

        if (error) {
          throw error;
        }

        setData(list);
        console.log("Programa de Vida y Ministerio obtenido:", list);

      } catch (err) {
        console.error("Error al obtener Vida y Ministerio:", err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="VidaYMinisterio">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Programa de la reunion vida y ministerio</h1>
        <hr />
        <br />
        
        {/* Renderizado de la imagen superior (el registro más reciente) */}
        {data.length > 0 && data[0] ? (
          <img id="imgVida" src={data[0].url} alt="Programa parte superior" />
        ) : (
          <p>Cargando primera parte...</p>
        )}
        
        <br />
        <br />
        <hr />
        
        {/* Renderizado de la imagen inferior (el segundo registro más reciente) */}
        {data.length > 1 && data[1] ? (
          <img id="imgVida" src={data[1].url} alt="Programa parte inferior" />
        ) : (
          <p>Cargando segunda parte...</p>
        )}
        
        <br />
        <br />
      </div>
    </div>
  );
}

export default VidaYMinisterio;