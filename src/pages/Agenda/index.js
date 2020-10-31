import React, { useEffect, useState } from 'react';
import { getAgendamentos, getSalasCadastro } from '../../services/API';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import './styles.css';
export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendaSala, setAgendaSala] = useState([]);
  const [data, setData] = useState([]);
  const [salas, setSalas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const fetchSalas = async () => {
    const { data: response } = await getSalasCadastro();
    setSalas(response.message);
  };
  const fetchAgendamentos = async () => {
    const { data: response } = await getAgendamentos();
    setAgendamentos(response.message);
  };

  const onChangeSala = (e) => {
    if (e === '#') {
      setData([]);
    } else {
      setHorarios([]);
      let dataAgenda = [];
      // const agendamentoSala = agendamentos.filter((s) => s.sala._id === e);
      // agendamentoSala.forEach((d) => {
      //   if (!dataAgenda.includes(d.dados.horario.data)) {
      //     dataAgenda.push(d.dados.horario.data);
      //   } else {
      //   }
      // });
      // setData(dataAgenda);
      for (let i = 0; i < 30; i++) {
        dataAgenda.push(i);
      }
      setData(dataAgenda);
      // setAgendaSala(agendamentoSala);
    }
  };
  const chooseData = (e) => {
    const horarios = agendaSala.filter((data) => data.dados.horario.data === e);
    setHorarios(horarios);
    console.log(horarios);
  };

  useEffect(() => {
    fetchSalas();
    fetchAgendamentos();
  }, []);
  return (
    <div className="main">
      <select
        name="sala"
        id="sala"
        onChange={(e) => onChangeSala(e.target.value)}
      >
        <option value="#">Selecione uma sala</option>
        {salas.map((sala) => (
          <option key={sala._id} value={sala._id}>
            {sala.name}
          </option>
        ))}
      </select>
      <div className="agenda">
        <ul>
          <>
            <FiArrowLeft />
            {data.map((periodo) => (
              <li key={periodo}>
                <label htmlFor={periodo}>
                  <div className="cardHorario">{periodo}</div>
                  <input
                    type="radio"
                    name="horario"
                    id={periodo}
                    onChange={() => chooseData(periodo)}
                  />
                </label>
              </li>
            ))}
            <FiArrowRight />
          </>
        </ul>
        <ul id="horarios">
          {horarios.map((horario) => (
            <li>
              {horario.dados.horario.data} - {horario.dados.horario.horaInicio}{' '}
              -{horario.dados.exame.name} - {horario.paciente.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
