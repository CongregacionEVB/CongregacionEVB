import './NoVisitar.css';
import Sidebar from './Sidebar';
import React, { useState } from 'react';
import { addDoc, collection, doc,getDocs, setDoc,getFirestore, serverTimestamp} from 'firebase/firestore';
import appFirebase from '../credenciales';
import { useEffect } from 'react';
import SheetViewer from './SheetViewer';

export const db = getFirestore(appFirebase);

const isPDF = (url) => /.*\.pdf(\?.*)?$/.test(url);

function Zoom(props) {

  const [data, setData] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      let list = [];
      try
      {
    const querySnapshot = await getDocs(collection(db,"Zoom"));
    querySnapshot.forEach((doc) => {
      list.push({id: doc.id,...doc.data()});
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    setData(list);
  }catch(err)
  {
    console.log(err);
  }
    };
    fetchData();
  },[])

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = function(evento) {
    setSidebarVisible(!sidebarVisible);
  };

  const goToGoogleSheets = () => {
    window.open("https://docs.google.com/spreadsheets/d/11968Yq2O9I9VH2vr46gB-r1wvUAoR6EqoLSgTx0oRrs/edit?gid=0#gid=0", "_blank");  
  };

  return (
    <div className="Zoom">
        <Sidebar visible={sidebarVisible} usuario = {props.usuario}/>

        <button className="toggle-btn" onClick={toggleSidebar}><img src="img territorios/menu2.png" alt="Toggle Sidebar" /></button>

        <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
    <hr/>
    <h1>Zoom</h1>
    <hr/>
    <SheetViewer hoja="Zoom"></SheetViewer>
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

export default Zoom;
