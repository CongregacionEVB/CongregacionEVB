import React, { useEffect, useState, useRef } from 'react';
import './Sidebar.css';

import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
const auth = getAuth(appFirebase);

function Sidebar({ visible, usuario }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedElements, setMatchedElements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const elementsToSearch = document.querySelectorAll("details, summary, img, h1, p, th, td");

    const search = () => {
      const term = searchTerm.trim().toLowerCase();
      if (term.length === 0) {
        setMatchedElements([]);
        return;
      }

      const matches = [];
      elementsToSearch.forEach((element) => {
        const text = element.textContent.toLowerCase();
        if (text.includes(term)) {
          matches.push(element);
        }
      });

      setMatchedElements(matches);
      setCurrentIndex(0);
    };

    search();
  }, [searchTerm]);

  const scrollToElement = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (matchedElements.length > 0) {
      scrollToElement(matchedElements[currentIndex]);
    }
  }, [currentIndex, matchedElements]);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNextClick = () => {
    if (matchedElements.length > 0) {
      setCurrentIndex((currentIndex + 1) % matchedElements.length);
    }
  };

  const handlePrevClick = () => {
    if (matchedElements.length > 0) {
      setCurrentIndex((currentIndex - 1 + matchedElements.length) % matchedElements.length);
    }
  };

  return (
    <div className={`sidebar ${visible ? 'visibleSideBar' : 'hiddenSideBar'}`}>
      <ul>
        <h2 className='cartel'>{usuario ? "Admin" : "Invitado"}</h2>
        <input
          type="text"
          id="searchInput"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          ref={searchInputRef}
        />
        <button id="prevButton" onClick={handlePrevClick}>
          <img src="img territorios/flechaA.png" height="20" alt="Prev" />
        </button>
        <button id="nextButton" onClick={handleNextClick}>
          <img src="img territorios/flechaAB.png" height="20" alt="Next" />
        </button>
        <hr />
        <li><a href="https://congregacionevb.github.io/CongregacionEVB/">INICIO</a></li>
        <hr />
        <li><a href="SalidasPredicacion">SALIDAS DE PREDICACION</a></li>
        <hr />
        <li><a href="NoVisitar">NO VISITAR</a></li>
        <hr />
        <li><a href="Territorios">TERRITORIOS</a></li>
        <hr />
        <li><a href="VidaYMinisterio">VIDA Y MINISTERIO</a></li>
        <hr />
        <li><a href="Organigrama">ORGANIGRAMA</a></li>
        <hr />
        <li><a href="Zoom">ZOOM</a></li>
        <hr />
        <li><a href="GruposPredicacion">GRUPOS DE PREDICACION</a></li>
        <hr/>
        <li><a href="Anuncios">ANUNCIOS</a></li>
        <hr />
        {usuario && (
          <>
            <li><a href="Admin">MULTIMEDIA</a></li>
            <hr />
            <li><a href="Formulario">FORMULARIO</a></li>
            <hr/>
          </>
        )}
        <li>
          {usuario ? <button className="logoutButton" onClick={() => signOut(auth)}>LOG OUT</button> : <a href="Login">LOG IN</a>}
        </li>
        <hr />
      </ul>
    </div>
  );
}

export default Sidebar;
