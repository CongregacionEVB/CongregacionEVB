import React, { useEffect, useState } from "react";
import './SheetViewer.css';

const SheetViewer = (props) => {
  const [data, setData] = useState([]); // Inicializa como un array vacío
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const apiUrl = "https://api.steinhq.com/v1/storages/673f7bffc0883333655272c8"; // URL de SteinHQ
  //const sheetName = "Hoja 1"; // Nombre de la hoja
  const sheetName = props.hoja; // hoja 2

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/${sheetName}`);
        const result = await response.json();

        // Asegúrate de que `result` es un array
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Los datos devueltos no son un array:", result);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!Array.isArray(data)) {
    return <p>Error: Los datos no tienen el formato esperado.</p>;
  }

  return (
    <div className="SheetViewer">
      <table border="1">
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SheetViewer;
