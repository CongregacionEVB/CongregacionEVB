import React, { useState } from 'react';
import './Inicio.css';
import Sidebar from './Sidebar';


function Inicio(props) {

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="Inicio">
      <Sidebar visible={sidebarVisible} usuario = {props.usuario}/>

      <button className="toggle-btn" onClick={toggleSidebar}><img src="img territorios/menu2.png" alt="Toggle Sidebar" /></button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <div id="Titulo">
        <br/>
          <br/>
          <h1>Congregación Este Villa Bosch</h1>
          
        </div>

        <div id="Texto">
          <br/>
          <br/>
          <h2>(SALMO 56:3)</h2>
          <h2>"Cuando tengo miedo, pongo mi confianza en ti"</h2>
          <br/>
          <br/>
        </div>

        <footer>
          <div id="Horarios">
          <br/>
            <h6> R E U N I O N E S :</h6>
            <br/>
            <h6>J U E V E S: 19:30</h6>
            <h6>D O M I N G O S : 10:00</h6>
            <br/>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Inicio;
