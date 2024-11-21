import React, { useState, useEffect } from 'react';
import './Anuncios.css';
import Sidebar from './Sidebar';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const isPDF = (url) => /.*\.pdf(\?.*)?$/.test(url);
const isVideo = (url) => /.*\.(mp4|avi|mov)(\?.*)?$/.test(url);

function Anuncios(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const q = query(collection(db, "AnunciosEVB"), orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
          console.log(doc.id, " => ", doc.data());
        });
        setData(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="Anuncios">
      <Sidebar visible={sidebarVisible} usuario={props.usuario} />

      <button className="toggle-btn" onClick={toggleSidebar}>
        <img src="img territorios/menu2.png" alt="Toggle Sidebar" />
      </button>

      <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
        <hr />
        <h1>Anuncios</h1>
        <hr />
        <div id='PLACEHOLDER'>
          {data.map((item, index) => (
            <div key={index}>
              {isPDF(item.url) ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img className='pdfAnun' src="img territorios/pdf-icon.png" alt={`Anuncio ${index + 1}`} />
                  <h3 id='pdfText'>{item.name}</h3>
                </a>
              ) : isVideo(item.url) ? (
                <video className="imgAnun" controls src={item.url}></video>
              ) : (
                <img className="imgAnun" src={item.url} alt={`Anuncio ${index + 1}`} />
              )}
              <br />
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Anuncios;
