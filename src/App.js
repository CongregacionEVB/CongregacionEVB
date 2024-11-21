import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import Inicio from './componentes/Inicio';
import SalidasPredicacion from './componentes/SalidasPredicacion';
import Anuncios from './componentes/Anuncios';
import NoVisitar from './componentes/NoVisitar';
import Territorios from './componentes/Territorios';
import VidaYMinisterio from './componentes/VidaYMinisterio';
import Login from './componentes/Login';
import ModoAdmin from './componentes/ModoAdmin';
import Formulario from './componentes/Formulario';
import Organigrama from './componentes/Organigrama';
import Zoom from './componentes/Zoom';
import GruposPredicacion from './componentes/GruposPredicacion';

import appFirebase from './credenciales';
import {getAuth, onAuthStateChanged} from 'firebase/auth'



const auth = getAuth(appFirebase)

function App() {
  const [usuario, setUsuario] = useState(null)
  onAuthStateChanged(auth,(usuarioFirebase)=>{
    if(usuarioFirebase){
      setUsuario(usuarioFirebase)
    }
    else{
      setUsuario(null)
    }
  }) 


  return (
    <Router basename='/CongregacionEVB'>
      <Routes>
        <Route exact path="/" element={<Inicio usuario={usuario}/>}>
        </Route>
        <Route path="/NoVisitar" element={<NoVisitar usuario={usuario}/>}>
        </Route>
        <Route path="/Anuncios" element={<Anuncios usuario={usuario}/>}>
        </Route>
        <Route path="/Territorios" element={<Territorios usuario={usuario}/>}>
        </Route>
        <Route path="/VidaYMinisterio" element={<VidaYMinisterio usuario={usuario}/>}>
        </Route>
        <Route path="/Organigrama" element={<Organigrama usuario={usuario}/>}>
        </Route>
        <Route path="/Zoom" element={<Zoom usuario={usuario}/>}>
        </Route>
        <Route path="/GruposPredicacion" element={<GruposPredicacion usuario={usuario}/>}>
        </Route>
        <Route path="/SalidasPredicacion" element={<SalidasPredicacion usuario={usuario}/>}>
        </Route>
        <Route path="/Login" element={<Login usuario={usuario}/>}>
        </Route>
        <Route path="/Admin" element={<ModoAdmin usuario={usuario}/>}>
        </Route>
        <Route path="/Formulario" element={<Formulario usuario={usuario}/>}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;