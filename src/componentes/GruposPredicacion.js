import './VidaYMinisterio.css';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

const isPDF = (url) => /.*\.pdf(\?.*)?$/.test(url);

function GruposPredicacion(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos la consulta usando el nombre exacto de la tabla y ordenamos por el más reciente
        const { data: list, error } = await supabase
          .from('Grupos de Predicacion')
          .select('*')
          .order('timeStamp', { ascending: false });

        if (error) {
          throw error;
        }

        setData(list);
        console.log("Grupos de predicación obtenidos:", list);

      } catch (err) {
        console.error("Error al obtener los grupos:", err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="GruposPredicacion">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Grupos De Predicacion</h1>
        <hr />
        <br />
        
        {data.length > 0 && data[0] ? (
          isPDF(data[0].url) ? (
            <a href={data[0].url} target="_blank" rel="noopener noreferrer">
              <img className='pdfAnun' src="img territorios/pdf-icon.png" alt={'Conf'} />
              <h3 id='pdfText'>{data[0].name}</h3>
            </a>
          ) : (
            <img id="imgVida" src={data[0].url} alt={'Conf'} />
          )
        ) : (
          <p>Cargando información o no hay grupos disponibles.</p>
        )}
        
        <br />
        <br />
      </div>
    </div>
  );
}

export default GruposPredicacion;