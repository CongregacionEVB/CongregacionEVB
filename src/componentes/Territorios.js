import './Territorios.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

const isPDF = (url) => /.*\.pdf(\?.*)?$/.test(url);

function Territorios(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consulta a la tabla TerritoriosEVB, trayendo el documento más reciente primero
        const { data: list, error } = await supabase
          .from('Territorios')
          .select('*')
          .order('timeStamp', { ascending: true });

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
        
        {/* Renderizado dinámico y modular */}
        {data.length === 0 ? (
          <p>Cargando información o no hay contenido disponible...</p>
        ) : (
          data.map((item, index) => (
            <div key={item.id} style={{ marginBottom: '30px', width: '100%' }}>
              {isPDF(item.url) ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img className='pdfAnun' src="img territorios/pdf-icon.png" alt={`PDF ${index + 1}`} />
                  <h3 id='pdfText'>{item.name}</h3>
                </a>
              ) : (
                <img id="imgVida" src={item.url} alt={`Contenido ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              )}
              
              {/* Agrega una línea separadora entre elementos, excepto después del último */}
              {index < data.length - 1 && (
                <>
                  <br /><br />
                  <hr style={{ width: '80%', margin: '0 auto' }} />
                  <br />
                </>
              )}
            </div>
          ))
        )}
        
        <br />
        <br />
      </div>
    </div>
  );
}

export default Territorios;