import './SalidasPredicacion.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

const isPDF = (url) => /.*\.pdf(\?.*)?$/.test(url);

function SalidasPredicacion(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consulta a la tabla, trayendo el documento más reciente primero
        const { data: list, error } = await supabase
          .from('SalidasDePredicacion')
          .select('*')
          .order('timeStamp', { ascending: false });

        if (error) {
          throw error;
        }

        setData(list);
        console.log("Salidas de predicación obtenidas:", list);

      } catch (err) {
        console.error("Error al obtener las salidas:", err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="SalidasPredicacion">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Salidas de predicación</h1>
        <hr />
        
        {data.length > 0 && data[0] ? (
          isPDF(data[0].url) ? (
            <a href={data[0].url} target="_blank" rel="noopener noreferrer">
              <img className='pdfAnun' src="img territorios/pdf-icon.png" alt={'Conf'} />
              <h3 id='pdfText'>{data[0].name}</h3>
            </a>
          ) : (
            <img className="imgSal" src={data[0].url} alt={'Conf'} />
          )
        ) : (
          <p>Cargando información o no hay salidas disponibles.</p>
        )}
        
        <br />
        <hr />
      </div>
    </div>
  );
}

export default SalidasPredicacion;