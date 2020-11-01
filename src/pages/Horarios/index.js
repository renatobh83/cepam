import React, { useEffect } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';
import { FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { useCallback } from 'react';
import {
  getHorarioBySala,
  getSalasCadastro,
  deleteHorario,
} from '../../services/API';
import { getHours } from '../../utils/getHours';
import generatePDF from '../../utils/exportJSPDF';
import { useHistory } from 'react-router-dom';

function Horarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [salas, setSalas] = useState([]);
  const [sala, setSala] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const history = useHistory();
  const fetchSalas = useCallback(async () => {
    await getSalasCadastro().then((res) => {
      if (res.data.statusCode === 200) {
        setSalas(res.data.message);
        setIsLoading(false);
      }
    });
  }, []);

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
  const handleHorarios = useCallback(
    async (sala) => {
      try {
        await getHorarioBySala(sala).then((res) => {
          getHours(res.data.message, (value) => {
            setHorarios((oldValues) => [...oldValues, value].sort(compare));
            setIsLoading(false);
          });

          setIsLoading(false);
        });
      } catch (error) {
        history.push('/');
      }
    },
    [] // eslint-disable-line
  );
  const compare = (a, b) => {
    return (
      Date.parse(
        a.data + a.horaInicio.slice(0, -2) + ' ' + a.horaInicio.slice(-2)
      ) -
      Date.parse(
        b.data + b.horaInicio.slice(0, -2) + ' ' + b.horaInicio.slice(-2)
      )
    );
  };
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
          {horarios.map((horario) => (
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
    </div>
  );
}

export default Horarios;
