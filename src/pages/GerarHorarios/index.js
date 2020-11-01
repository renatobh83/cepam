import React, { useState } from 'react';

import InputMask from 'react-input-mask';

import './styles.css';
import { useCallback } from 'react';
import {
  checkAcessoGerarHorario,
  getInterval,
  getSalasCadastro,
  postHorarios,
} from '../../services/API';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ErroPermission from '../../utils/chekPermission';
import Loading from '../../components/Loading';
export default function GerarHorarios() {
  const [horaInicio, setHoraInicio] = useState('');
  const [dataInicio, setdataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sala, setSala] = useState('');
  const [setor, setSetor] = useState('');
  const [salas, setSalas] = useState([]);
  const [horaFim, setHoraFim] = useState('');
  const [dia, setDia] = useState([]);
  const [intervalo, setIntervalo] = useState('');
  const [dias] = useState(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']);
  const history = useHistory();

  const selectSalaAndSetor = async (obj) => {
    if (obj) {
      const { setor } = salas.find((sala) => sala._id === obj);
      const { data: time } = await getInterval(obj);
      if (time) {
        setIntervalo(time.message.IntervaloSala[0].setor.time.split(':')[1]);
      }
      setSala(obj);
      setSetor(setor);
    } else {
      setIntervalo('');
    }
  };
  const fetchSalas = useCallback(async () => {
    const { data: salas } = await getSalasCadastro();

    setSalas(salas.message);
  }, []);
  useEffect(() => {
    fetchSalas();
  }, []);
  const pushDays = (day, e) => {
    if (e.target.checked) {
      setDia([...dia, day]);
    } else {
      const index = dia.indexOf(day);
      if (index > -1) {
        dia.splice(index, 1);
      }
    }
  };

  const clearAllInputs = () => {
    history.push('/');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const intervaloNumber = parseInt(intervalo);
    if (dia.length === 0) alert('Selecionar um dia da semana');

    const data = {
      sala,
      setor,
      dataInicio,
      dataFim,
      t1: horaInicio,
      t2: horaFim,
      intervalo: intervaloNumber,
      daysWeek: dia,
    };

    await postHorarios(data).then(() => window.location.reload());
  };
  const verificarAcesso = async () => {
    try {
      await checkAcessoGerarHorario();
      setIsLoading(false);
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  };
  useEffect(() => {
    verificarAcesso();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="gerarHorariosContainer">
      <form className="selectForm forms" onSubmit={handleSubmit}>
        <select
          id="sala"
          required
          onChange={(e) => selectSalaAndSetor(e.target.value)}
        >
          <option value="">Selecionar sala</option>
          {salas.map((sala) => (
            <option value={sala._id} key={sala._id}>
              {sala.name}
            </option>
          ))}
        </select>
        <span>Intervalo {intervalo}</span>
        <div className="diasForm">
          <ul>
            {dias.map((day, key) => (
              <li key={key}>
                <label htmlFor={key}>{day}</label>
                <input
                  type="checkbox"
                  style={{ display: 'block' }}
                  name={day}
                  id={key}
                  value={key}
                  onChange={(e) => pushDays(key, e)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="intervalo data">
          <span>Data inicio</span>
          <InputMask
            mask="99/99/9999"
            maskPlaceholder="-"
            inputMode="numeric"
            value={dataInicio}
            required
            onChange={(e) => setdataInicio(e.target.value)}
          />

          <span>Data Fim</span>
          <InputMask
            mask="99/99/9999"
            required
            inputMode="numeric"
            maskPlaceholder="-"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className="intervalo">
          <span>Hora Inicio</span>

          <InputMask
            mask="99:99"
            inputMode="numeric"
            maskPlaceholder="-"
            value={horaInicio}
            required
            onChange={(e) => setHoraInicio(e.target.value)}
          />

          <span>Hora Fim</span>
          <InputMask
            mask="99:99"
            required
            inputMode="numeric"
            maskPlaceholder="-"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="button">
            Gerar
          </button>
          <button
            type="submit"
            onClick={clearAllInputs}
            className="button button-danger"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
