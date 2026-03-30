import './Territorios.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

function Territorios(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consulta a la tabla TerritoriosEVB, trayendo el documento más reciente primero
        const { data: list, error } = await supabase
          .from('Territorios')
          .select('*')
          .order('timeStamp', { ascending: false });

        if (error) {
          throw error;
        }

        setData(list);
        console.log("Territorios obtenidos:", list);

      } catch (err) {
        console.error("Error al obtener los territorios:", err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function (evento) {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="Territorios">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Territorio de la Congregación</h1>
        <hr />
        
        {data.length > 0 && data[0] ? (
          <img id="imgTer" src={data[0].url} alt="Territorio de la congregación" />
        ) : (
          <p>Cargando información o no hay mapa de territorio disponible.</p>
        )}
        
        <br />
        <br />
      </div>
    </div>
  );
}

export default Territorios;