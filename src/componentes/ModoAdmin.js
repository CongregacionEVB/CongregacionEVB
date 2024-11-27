import * as React from 'react';
import { useState, useEffect } from 'react';
import './ModoAdmin.css';
import Sidebar from './Sidebar';
import appFirebase from '../credenciales';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { tab } from '@testing-library/user-event/dist/tab';

const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);

//variables enviar imagen
var rutaImagen;
var nombreImagen;
var tabla;

var modificando = "...";

function ModoAdmin(props) {
  const [file, setFile] = useState(null);
  const [subido, setSubido] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú desplegable

  const handleClick = (event) => {
    setMenuOpen(!menuOpen); // Cambia el estado para abrir/cerrar el menú desplegable
  };

  const handleClose = () => {
    setMenuOpen(false); // Cierra el menú cuando se hace clic fuera de él (si es necesario)
  };

  const handleMenuItemClick = (option) => {
    const date = new Date();
    // Aquí puedes manejar la lógica según el item seleccionado
    switch(option)
    {
      case "SalidasDePredicacion":
        tabla = "SalidasDePredicacionEVB";
        nombreImagen = "EVB/SalidasDePredicacionEVB" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png"; 
        modificando = "Salidas De Predicacion";
        break;
      case "Territorios":
        tabla = "TerritoriosEVB";  
        nombreImagen = "EVB/TerritoriosEVB.png";
        modificando = "Territorios";
        break;
      case "Anuncios":
        tabla = "AnunciosEVB";
        nombreImagen = "EVB/AnunciosEVB" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png";  
        modificando = "Anuncios";
        break;
      case "VidaYMinisterio":
        tabla = "Vida y ministerio EVB";
        nombreImagen = "EVB/VidaYMinisterioEVB" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png";   
        modificando = "Vida y ministerio";
        break;
      case "GruposDePredicacion":
        tabla = "Grupos de Predicacion";
        nombreImagen = "EVB/GruposDePredicacionEVB" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png"; 
        modificando = "Grupos De Predicacion";
        break;
      case "Organigrama":
        tabla = "Organigrama";
        nombreImagen = "EVB/Organigrama" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png";  
        modificando = "Organigrama";
        break;
      case "Asignaciones":
        tabla = "Asignaciones";
        nombreImagen = "EVB/Asignaciones" + ": " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ".png";  
        modificando = "Asignaciones";
        break;
    }
    console.log(option);
    console.log(tabla);
    handleClose(); // Cierra el menú después de seleccionar una opción
  };

  useEffect(() => {
    const uploadFile = () => {
      const fileExtension = file.name.split('.').pop(); // Obtén la extensión del archivo
      let fileName = null;
      if (nombreImagen.includes("Anuncios") || nombreImagen.includes("Organigrama") || nombreImagen.includes("GruposDePredicacionEVB") || nombreImagen.includes("VidaYMinisterioEVB") || nombreImagen.includes("SalidasDePredicacionEVB")|| nombreImagen.includes("Asignaciones"))
      {
        fileName = `${nombreImagen.replace(".png", `.${fileExtension}`)}`;
      }
      else 
      {
        fileName = nombreImagen;
      }
      nombreImagen = fileName; //PUEDE ROMPER TODO????
      console.log(fileName);
      /*var fileName = nombreImagen.includes("Anuncios")
        ? `${nombreImagen.replace(".png", `.${fileExtension}`)}`
        : nombreImagen; */

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            rutaImagen = downloadURL;
            console.log('File available at', downloadURL);
            setSubido(true);
          });
        }
      );
    };
  
    if (file) {
      uploadFile();
    }
  }, [file]);

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log(db);
    try {
      if (tabla == "AnunciosEVB")
      {
        nombreImagen = nombreImagen.split("/")[1]; // EXPERIMENTAL
        await addDoc(collection(db, tabla,), { // addDoc(collection(db, "cities")
          name: nombreImagen,
          url: rutaImagen, // Asegúrate de tener la URL correcta aquí
          timeStamp: serverTimestamp(),
        });
        console.log('Documento añadido con éxito');
        alert("Documento añadido con éxito");
      }
      else 
      {
        if (tabla == "Organigrama")
        {
          nombreImagen = nombreImagen.split("/")[1];
          await setDoc(doc(db, tabla, 'imagen'), {
            name: nombreImagen,
            url: rutaImagen, // Asegúrate de tener la URL correcta aquí
            timeStamp: serverTimestamp(),
          });
          console.log('Documento añadido con éxito');
          alert("Documento añadido con éxito");
        }
        else
        {
          await setDoc(doc(db, tabla, 'imagen'), {
            name: tabla,
            url: rutaImagen, // Asegúrate de tener la URL correcta aquí
            timeStamp: serverTimestamp(),
          });
          console.log('Documento añadido con éxito');
          alert("Documento añadido con éxito");
        }
    }
    } catch (error) {
      console.error('Error al añadir el documento: ', error);
    }
    finally {
      setSubido(false);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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
          <hr/>
          <h1>Cambios multimedia</h1>
          <hr/>
          {/* Menú desplegable vertical */}
          <div className="dropdown">
            <button onClick={handleClick} className="dropbtn">Seleccionar</button>
            {menuOpen && (
              <div className="dropdown-content">
                <a href="#" onClick={() => handleMenuItemClick('SalidasDePredicacion')}>Salidas de predicacion</a>
                <a href="#" onClick={() => handleMenuItemClick('Territorios')}>Territorios</a>
                <a href="#" onClick={() => handleMenuItemClick('Anuncios')}>Anuncios</a>
                <a href="#" onClick={() => handleMenuItemClick('VidaYMinisterio')}>Vida y ministerio</a>
                <a href="#" onClick={() => handleMenuItemClick('GruposDePredicacion')}>Grupos De Predicacion</a>
                <a href="#" onClick={() => handleMenuItemClick('Organigrama')}>Organigrama</a>
                <a href="#" onClick={() => handleMenuItemClick('Asignaciones')}>Asignaciones</a>
              </div>
            )}
          </div>
          <br/>
          <span>{modificando}</span> <br/>
          
          <form>
            <input
              type="file"
              id="file"
              accept=".png,.jpg,.jpeg,.pdf,.mp4,.avi,.mov"  // Agrega los tipos de archivo permitidos
              onChange={(e) => setFile(e.target.files[0])}
            />
          </form>
          <img width='600px' id='imgUpl' src={file ? URL.createObjectURL(file) : ''} /> <br/>
          <button disabled={subido == false} onClick={handleAdd}>Enviar</button>

        </div>
      </div>
    </div>
  );
}

export default ModoAdmin;
