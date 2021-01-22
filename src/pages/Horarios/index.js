import React, { useEffect } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';
import { FiDownload, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import { useCallback } from 'react';
import { deleteHorario, getSalas, getHorarios } from '../../services/API';
import { getHours } from '../../utils/getHours';
import generatePDF from '../../utils/exportJSPDF';
import { useHistory } from 'react-router-dom';
import ErroPermission from '../../utils/chekPermission';
import Pagination from '../../components/Pagination';



function Horarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [salas, setSalas] = useState([]);
  const [sala, setSala] = useState(null);
  const [horarios, setHorarios] = useState([]);
 
  const history = useHistory();
  const [skip, setSkip] =useState(10)

const [currentPage, setCurrentPage] = useState(1);
const [limitHorario] = useState(5);

  const fetchSalas = useCallback(async () => {
    try {
      await getSalas().then((res) => {
        if (res.data.statusCode === 200) {
          setSalas(res.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); // eslint-disable-line

  const setDiaSemana = (dia) => {
    switch (dia) {
      case 0:
        return 'Domingo';
      case 1:
        return 'Segunda';
      case 2:
        return 'Terça';
      case 3:
        return 'Quarta';
      case 4:
        return 'Quinta';
      case 5:
        return 'Sexta';
      case 6:
        return 'Sábado';
      default:
        break;
    }
  };
   const indexOfLastPage = currentPage * limitHorario;
  const indexOfFirstPage = indexOfLastPage - limitHorario;
  const current = horarios.slice(indexOfFirstPage, indexOfLastPage);

  const pageNumbers = [];
  const totalPages = Math.ceil(horarios.length / limitHorario);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }



  const handleHorarios = useCallback(async (sala,pg) => {
    try {
      await getHorarios(sala).then((res) => {
        getHours(res.data.message, (value) => {
         setHorarios(value)
          setIsLoading(false);
        });
        setIsLoading(false);
      });
 
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); //eslint-disable-line
  const apagarHorario = (date) => {
    const data = {
      deleteHorary: [date],
      sala: sala,
    };

    deleteHorario(data).then(() => {
      const fitler = horarios.filter((h) => h.id !== date);
      setHorarios(fitler);
    });
  };
    //pagination
  
    const Direita = () => {
    if(currentPage <= pageNumbers.length){
       setCurrentPage(currentPage + 1 )
    }
  
    };
    const Esquerda = () => {
     if(currentPage > 1){
        setCurrentPage(currentPage - 1 )
     }
    };

    
  const exportPDF = () => {
    if (horarios.length) {
      const data = horarios.map((h) => [
        h.data,
        setDiaSemana(h.diaSemana),
        h.timeInterval,
        h.horaInicio,
      ]);
      const salaName = salas.find((s) => s._id === sala);

      generatePDF(
        [['Periodo', 'Dia Semana', 'Intervalo', 'Hora']],
        `Sala ${salaName.name}`,
        data
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (sala !== null && sala !== '#') {
      setHorarios([]);
      handleHorarios(sala);
    } else {
      setIsLoading(false);
      setHorarios([]);
    }
  }, [sala]); // eslint-disable-line

  useState(() => {
    fetchSalas();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      <h2>Horarios</h2>
      <div className="listPage">
        <div className="horarioGroup">
          <label htmlFor="sala">Sala</label>
          <select
            name="sala"
            id="sala"
            onChange={(e) => setSala(e.target.value)}
          >
            <option value="#">Selecione uma sala</option>
            {salas.map((sala) => (
              <option key={sala._id} value={sala._id}>
                {sala.name}
              </option>
            ))}
          </select>
        </div>
        <div className="header">
          <span>Data</span>
          <span>Dia Sem.</span>
          <span>Intervalo</span>
          <span>
            <FiDownload
              size={20}
              onClick={exportPDF}
              style={{ cursor: 'pointer' }}
            />
          </span>
        </div>
        <ul id="horarios">
          {current.map((horario) => (
            <li key={horario.id}>
              <div className="interval">
                <span>{horario.data}</span>
                <span>{setDiaSemana(horario.diaSemana)}</span>
                <span>{horario.horaInicio}</span>

                <ModalConfirm
                  title="Confirma"
                  description="Desaja apagar o intervalo"
                >
                  {(confirm) => (
                    <button
                      className="button button-danger"
                      type="submit"
                      onClick={confirm(() => apagarHorario(horario.id))}
                    >
                      Apagar
                    </button>
                  )}
                </ModalConfirm>
              </div>
            </li>
       
          ))}
               
        </ul>
      
      </div>
     
 {horarios.length > 0 &&
  <>
  <div className="arrow">
  <FiArrowLeft size={30} onClick={Esquerda}/> 
 
   <FiArrowRight size={30}onClick={Direita}/>
  </div>
 
   </>
 }

            
         
    </div>
  );
}

export default Horarios;
