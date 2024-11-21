import './VidaYMinisterio.css';
import Sidebar from './Sidebar';
import React, { useState } from 'react';
import { addDoc, collection, doc,getDocs, setDoc,getFirestore, serverTimestamp} from 'firebase/firestore';
import appFirebase from '../credenciales';
import { useEffect } from 'react';

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

  return (
    <div className="Zoom">
        <Sidebar visible={sidebarVisible} usuario = {props.usuario}/>

        <button className="toggle-btn" onClick={toggleSidebar}><img src="img territorios/menu2.png" alt="Toggle Sidebar" /></button>

        <div className={`content ${sidebarVisible ? 'visibleContent' : 'hiddenContent'}`}>
    <hr/>
    <h1>Zoom</h1>
    <hr/>
    <footer>
          <div className="Horarios">
          <br/>
            <h5> I D de la reunión :</h5>
            <h6> 9 9 9  3 3 3  2 2 9 9  </h6>
            <br/>
            <h6> C O N T R A S E Ñ A :</h6>
            <h6> 1 0 2 0 2 4 </h6>
            <br/>
          </div>
        </footer>
      </div>
    </div>

  );
  
}

export default Zoom;
