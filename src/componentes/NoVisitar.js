import React, { useState } from 'react';
import './NoVisitar.css';
import Sidebar from './Sidebar';
import SheetViewer from './SheetViewer';

function NoVisitar(props) {

    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = function(evento) {
      setSidebarVisible(!sidebarVisible);
    };
  
    const goToGoogleSheets = () => {
      window.open("https://docs.google.com/spreadsheets/d/11968Yq2O9I9VH2vr46gB-r1wvUAoR6EqoLSgTx0oRrs/edit?gid=0#gid=0", "_blank");  
    };
  


  return (
    <div  className="NoVisitar">
        <Sidebar visible={sidebarVisible} usuario = {props.usuario}/>

        <button className="toggle-btn" onClick={toggleSidebar}><img src="img territorios/menu2.png" alt="Toggle Sidebar" /></button>

        <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <div id="Titulo"> 
            <hr/>
            <h1>No visitar </h1>
            <hr/>
        </div>
        <SheetViewer hoja="No Visitar"></SheetViewer>
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
export default NoVisitar;
