import './NoVisitar.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';
import SheetViewer from './SheetViewer';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

function Zoom(props) {
  // Nota: Este estado 'data' guarda la información, pero actualmente no se muestra en el return
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: list, error } = await supabase
          .from('Zoom')
          .select('*')
          .order('timeStamp', { ascending: false });

        if (error) {
          throw error;
        }

        setData(list);
        console.log("Datos de Zoom obtenidos:", list);

      } catch (err) {
        console.error("Error al obtener datos de Zoom:", err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  const goToGoogleSheets = () => {
    window.open("https://docs.google.com/spreadsheets/d/11968Yq2O9I9VH2vr46gB-r1wvUAoR6EqoLSgTx0oRrs/edit?gid=0#gid=0", "_blank");  
  };

  return (
    <div className="Zoom">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Zoom</h1>
        <hr />
        
        {/* Renderizado de la hoja de cálculo */}
        <SheetViewer hoja="Zoom"></SheetViewer>
        
        {/* Botón exclusivo para administradores */}
        {props.usuario && (
          <>
            <button className="ver-formulario-btn" onClick={goToGoogleSheets}>
              Ver formulario
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Zoom;