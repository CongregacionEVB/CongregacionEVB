import * as React from 'react';
import { useState, useEffect } from 'react';
import './ModoAdmin.css';
import Sidebar from './Sidebar';
import { supabase } from '../credenciales';

function ModoAdmin(props) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estados de datos
  const [tablaSeleccionada, setTablaSeleccionada] = useState("");
  const [modificandoText, setModificandoText] = useState("Selecciona una categoría");
  const [elementosActuales, setElementosActuales] = useState([]);
  
  // Estados de carga y archivos
  const [cargandoLista, setCargandoLista] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [file, setFile] = useState(null);
  
  // Estado para saber si estamos añadiendo nuevo o reemplazando uno existente
  const [modoAccion, setModoAccion] = useState({ tipo: 'añadir', idBaseDatos: null, urlAntigua: null });

  // --- OBTENER DATOS DE LA CATEGORÍA ---
  const cargarElementos = async (tabla) => {
    setCargandoLista(true);
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .order('timeStamp', { ascending: true }); // Orden cronológico para verlos en orden

      if (error) throw error;
      setElementosActuales(data);
    } catch (error) {
      console.error("Error al cargar elementos:", error.message);
    } finally {
      setCargandoLista(false);
    }
  };

  const handleMenuItemClick = (tabla, nombreVisual) => {
    setTablaSeleccionada(tabla);
    setModificandoText(nombreVisual);
    setMenuOpen(false);
    setFile(null); // Limpiamos el input si había algo
    setModoAccion({ tipo: 'añadir', idBaseDatos: null, urlAntigua: null });
    cargarElementos(tabla);
  };

  // --- ELIMINAR ELEMENTO ---
  const handleEliminar = async (id, url) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este elemento?")) return;
    
    setProcesando(true);
    try {
      // 1. Extraer la ruta del archivo del URL público para borrarlo del Storage
      const rutaArchivo = url.split('/multimedia/')[1];
      if (rutaArchivo) {
        await supabase.storage.from('multimedia').remove([rutaArchivo]);
      }

      // 2. Borrar el registro de la base de datos
      await supabase.from(tablaSeleccionada).delete().eq('id', id);
      
      alert("Elemento eliminado con éxito.");
      cargarElementos(tablaSeleccionada); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar:", error.message);
      alert("Hubo un error al eliminar el archivo.");
    } finally {
      setProcesando(false);
    }
  };

  // --- SUBIR O REEMPLAZAR ELEMENTO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !tablaSeleccionada) return;

    setProcesando(true);

    try {
      const date = new Date();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${tablaSeleccionada}_${date.getTime()}.${fileExtension}`;
      const filePath = `EVB/${fileName}`;

      // 1. Subir nuevo archivo al Storage
      const { error: uploadError } = await supabase.storage
        .from('multimedia')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtener la nueva URL
      const { data: publicUrlData } = supabase.storage
        .from('multimedia')
        .getPublicUrl(filePath);
      const rutaImagenNueva = publicUrlData.publicUrl;

      if (modoAccion.tipo === 'añadir') {
        // 3a. AÑADIR NUEVO: Insertar en la base de datos
        await supabase.from(tablaSeleccionada).insert([
          { name: file.name, url: rutaImagenNueva }
        ]);
        alert("Añadido con éxito");

      } else if (modoAccion.tipo === 'reemplazar') {
        // 3b. REEMPLAZAR: Actualizar base de datos y borrar archivo viejo
        
        // Actualizar registro en BD
        await supabase.from(tablaSeleccionada)
          .update({ name: file.name, url: rutaImagenNueva })
          .eq('id', modoAccion.idBaseDatos);
        
        // Borrar imagen vieja del Storage para no acumular basura
        const rutaAntigua = modoAccion.urlAntigua.split('/multimedia/')[1];
        if (rutaAntigua) {
          await supabase.storage.from('multimedia').remove([rutaAntigua]);
        }
        
        alert("Reemplazado con éxito");
      }

      // Limpiar estados y recargar
      setFile(null);
      document.getElementById("file").value = "";
      setModoAccion({ tipo: 'añadir', idBaseDatos: null, urlAntigua: null });
      cargarElementos(tablaSeleccionada);

    } catch (error) {
      console.error('Error:', error.message);
      alert("Hubo un error en el proceso.");
    } finally {
      setProcesando(false);
    }
  };

  // --- PREVISUALIZACIÓN ---
  const renderPreview = () => {
    if (!file) return null;
    const isVideo = file.type.startsWith('video/');
    if (isVideo) return <video width="100%" controls src={URL.createObjectURL(file)} />;
    if (file.type === 'application/pdf') return <p>Archivo PDF listo para subir: {file.name}</p>;
    return <img style={{maxWidth: '100%', maxHeight: '300px'}} src={URL.createObjectURL(file)} alt="preview" />;
  };

  return (
    <div className="ModoAdmin">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={() => setSidebarVisible(!sidebarVisible)}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <div id="Titulo">
          <br /><br /><hr />
          <h1>Gestor Multimedia</h1>
          <hr />
          
          {/* MENÚ DE CATEGORÍAS */}
          <div className="dropdown">
            <button onClick={() => setMenuOpen(!menuOpen)} className="dropbtn">
              {modificandoText} ▼
            </button>
            {menuOpen && (
              <div className="dropdown-content">
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('SalidasDePredicacion', 'Salidas de predicación'); }}>Salidas de predicación</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Territorios', 'Territorios'); }}>Territorios</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('AnunciosEVB', 'Anuncios'); }}>Anuncios</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('VidaYMinisterio', 'Vida y ministerio'); }}>Vida y ministerio</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Grupos de Predicacion', 'Grupos De Predicacion'); }}>Grupos de Predicacion</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Organigrama', 'Organigrama'); }}>Organigrama</a>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleMenuItemClick('Asignaciones', 'Asignaciones'); }}>Asignaciones</a>
              </div>
            )}
          </div>
          <br /><br />

          {/* LISTA DE ELEMENTOS ACTUALES */}
          {tablaSeleccionada && (
            <div className="lista-elementos" style={{ backgroundColor: '#f9f9f9', padding: '1.1rem', borderRadius: '0.6em', marginBottom: '2rem',  maxWidth: '100vw' }}>
              <h3>Contenido actual</h3>
              {cargandoLista ? <p>Cargando...</p> : (
                elementosActuales.length === 0 ? <p>No hay contenido en esta sección.</p> : (
                  elementosActuales.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold' }}>#{index + 1}</span>
                        {item.url.includes('.pdf') ? (
                          <img src="img territorios/pdf-icon.png" alt="PDF" width="40" />
                        ) : (
                          <img src={item.url} alt="thumbnail" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                        )}
                        <span style={{ fontSize: '0.9rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.9rem', flexDirection: 'column'}}>
                        <button 
                          onClick={() => {
                            setModoAccion({ tipo: 'reemplazar', idBaseDatos: item.id, urlAntigua: item.url });
                            document.getElementById('file').focus();
                          }}
                          style={{ backgroundColor: '#ffc107', color: '#000', padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                          Reemplazar
                        </button>
                        <button 
                          onClick={() => handleEliminar(item.id, item.url)}
                          style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}

          {/* FORMULARIO DE SUBIDA (Sirve para Añadir y Reemplazar) */}
          {tablaSeleccionada && (
            <div style={{maxWidth: '100vw', padding: '1.1rem', border: '0.2rem dashed #ccc', borderRadius: '0.6em' }}>
              <h3>{modoAccion.tipo === 'añadir' ? 'Añadir Nuevo Elemento' : 'Reemplazando elemento existente...'}</h3>
              {modoAccion.tipo === 'reemplazar' && (
                <button 
                  onClick={() => {
                    setModoAccion({ tipo: 'añadir', idBaseDatos: null, urlAntigua: null });
                    setFile(null);
                    document.getElementById("file").value = "";
                  }} 
                  style={{ backgroundColor: '#6c757d', marginBottom: '15px', fontSize: '0.8rem' }}>
                  Cancelar Reemplazo
                </button>
              )}

              <form>
                <input
                  type="file"
                  id="file"
                  accept=".png,.jpg,.jpeg,.pdf,.mp4,.avi,.mov"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </form>
              
              <div style={{ margin: "20px 0" }}>
                 {renderPreview()}
              </div>
              
              <button 
                disabled={procesando || !file} 
                onClick={handleSubmit}
                style={{ backgroundColor: modoAccion.tipo === 'añadir' ? '#28a745' : '#ffc107', color: modoAccion.tipo === 'añadir' ? '#fff' : '#000' }}
              >
                {procesando ? "Procesando..." : (modoAccion.tipo === 'añadir' ? "Subir Nuevo" : "Confirmar Reemplazo")}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ModoAdmin;