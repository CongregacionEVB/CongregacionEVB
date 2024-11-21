import React, { useState } from 'react';
import './Formulario.css';
import Sidebar from './Sidebar';

function Formulario(props) {
  const [data, setData] = useState({
    UltimaVezRealizado: "",
    AsignadoA: "",
  });

  const handleChange = (e) => setData({...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un array de objetos con los territorios seleccionados
    const payload = checkedTerritories.map(territory => ({
      NumeroTerritorio: territory,
      UltimaVezRealizado: data.UltimaVezRealizado,
      AsignadoA: data.AsignadoA
    }));

    try {
      console.log("Datos a enviar:", payload);

      const res = await fetch("https://api.steinhq.com/v1/storages/673f8549c088333365527605/Sheet1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del servidor:", res);
      if (res.ok) {
        alert("Formulario actualizado con éxito");
      } else {
        const errorText = await res.text();
        console.error("Error en la respuesta del servidor:", errorText);
      }
    } catch (error) {
      console.log("Error al hacer la solicitud:", error);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [checkedTerritories, setCheckedTerritories] = useState([]);

  const toggleSidebar = function() {
    setSidebarVisible(!sidebarVisible);
  };

  const territories = Array.from({ length: 50 }, (_, i) => `Territorio ${i + 1}`);

  const handleCheckboxChange = (territory) => {
    setCheckedTerritories(prevChecked => {
      if (prevChecked.includes(territory)) {
        return prevChecked.filter(t => t !== territory);
      } else {
        return [...prevChecked, territory];
      }
    });
  };

  const goToGoogleSheets = () => {
    window.open("https://docs.google.com/spreadsheets/d/1xs95glJPcUWftsjCVLRoXlsmDRQC0I4xfRPBOA0deUw/edit?gid=0#gid=0", "_blank");  
  };

  return (
   
            <div className="Formulario">
            <Sidebar visible={sidebarVisible} usuario={props.usuario} />

            <button className="toggle-btn" onClick={toggleSidebar}>
            <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
            </button>

            <div className="main-content">
            <div className="scrollable-content">
              <div className="territories-list">
                <h2>Territorios</h2>
                <br/>
                {territories.map((territory, index) => (
                  <div key={index} className="territory-item">
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={checkedTerritories.includes(territory)}
                      onChange={() => handleCheckboxChange(territory)}
                    />
                    <label htmlFor={`checkbox-${index}`}>
                      {territory}
                    </label>
                    <button onClick={() => setSelectedTerritory(territory)}>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <br/><br/><br/><br/><br/>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Nombre:</label>
                  <br/>
                  <input type="text" id="name" name="AsignadoA" value={data.AsignadoA} onChange={handleChange}/>
                </div>
                <div>
                <br/>
                <label htmlFor="date">Fecha:</label>
                  <br/>
                  <input type="date" id="date" name="UltimaVezRealizado" value={data.UltimaVezRealizado} onChange={handleChange}/>
                </div>
                <div id='subDiv'>
                  <label htmlFor="submit"></label>
                  <br/>
                  <input type="submit" id="submit" name="submit"/>
                </div>
              </form>
              </div>



          <button className="ver-formulario-btn" onClick={goToGoogleSheets}>
            Ver formulario
          </button>
    </div>
    </div>

  );
}

export default Formulario;
