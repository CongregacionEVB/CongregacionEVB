import * as React from 'react';
import { useState } from 'react';
import './ModoAdmin.css';
import Sidebar from './Sidebar';

// Importamos el cliente de Supabase
import { supabase } from '../credenciales';

function ModoAdmin(props) {
  const [file, setFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false); // Para mostrar estado de carga
  const [menuOpen, setMenuOpen] = useState(false);
  const [tablaSeleccionada, setTablaSeleccionada] = useState("");
  const [modificandoText, setModificandoText] = useState("...");

  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (option, nombreVisual) => {
    // Almacenamos en el estado la tabla que se va a modificar
    setTablaSeleccionada(option);
    setModificandoText(nombreVisual);
    handleClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!file || !tablaSeleccionada) {
      alert("Por favor selecciona una categoría y un archivo.");
      return;
    }

    setSubiendo(true);

    try {
      const date = new Date();
      const fileExtension = file.name.split('.').pop();
      // Generamos un nombre único para evitar sobreescribir archivos en el Storage
      const fileName = `${tablaSeleccionada}_${date.getTime()}.${fileExtension}`;
      const filePath = `EVB/${fileName}`;

      // 1. Subir archivo a Supabase Storage (al bucket 'multimedia_evb')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('multimedia')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log('Archivo subido al Storage:', uploadData);

      // 2. Obtener la URL pública del archivo subido
      const { data: publicUrlData } = supabase.storage
        .from('multimedia')
        .getPublicUrl(filePath);

      const rutaImagen = publicUrlData.publicUrl;

      // 3. Guardar la referencia en la base de datos (Tabla correspondiente)
      const { error: dbError } = await supabase
        .from(tablaSeleccionada)
        .insert([
          { 
            name: file.name, // O puedes usar fileName si prefieres el nombre interno
            url: rutaImagen
            // El timeStamp se pone automáticamente con el DEFAULT NOW() en SQL
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      alert("Documento añadido con éxito");
      setFile(null); // Limpiar el input
      document.getElementById("file").value = "";

    } catch (error) {
      console.error('Error al subir el archivo o guardar en BD: ', error.message);
      alert("Hubo un error al subir el archivo.");
    } finally {
      setSubiendo(false);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Previsualización segura
  const renderPreview = () => {
    if (!file) return null;
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';

    if (isVideo) {
      return <video width="600" controls src={URL.createObjectURL(file)} />;
    }
    if (isPDF) {
      return <p>Previsualización de PDF no disponible. Archivo seleccionado: {file.name}</p>;
    }
    return <img width='600px' id='imgUpl' src={URL.createObjectURL(file)} alt="preview" />;
  };

  return (
    <div className="ModoAdmin">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <div id="Titulo">
          <br />
          <br />
          <hr />
          <h1>Cambios multimedia</h1>
          <hr />
          
          <div className="dropdown">
            <button onClick={handleClick} className="dropbtn">Seleccionar Categoría</button>
            {menuOpen && (
              <div className="dropdown-content">
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('SalidasDePredicacion', 'Salidas de predicación'); }}>Salidas de predicacion</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Territorios', 'Territorios'); }}>Territorios</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('AnunciosEVB', 'Anuncios'); }}>Anuncios</a>
                {/* Ahora Vida y Ministerio usa una sola tabla */}
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('VidaYMinisterio', 'Vida y ministerio'); }}>Vida y ministerio</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Grupos de Predicacion', 'Grupos De Predicacion'); }}>Grupos De Predicacion</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Organigrama', 'Organigrama'); }}>Organigrama</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Asignaciones', 'Asignaciones'); }}>Asignaciones</a>
              </div>
            )}
          </div>
          <br />
          
          <span>Modificando: {modificandoText}</span> <br />
          
          <form>
            <input
              type="file"
              id="file"
              accept=".png,.jpg,.jpeg,.pdf,.mp4,.avi,.mov"
              onChange={handleFileChange}
            />
          </form>
          
          <div style={{ margin: "20px 0" }}>
             {renderPreview()}
          </div>
          
          <button 
            disabled={subiendo || !file || !tablaSeleccionada} 
            onClick={handleAdd}
          >
            {subiendo ? "Subiendo..." : "Enviar"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ModoAdmin;