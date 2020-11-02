import React, { useState } from 'react';
import { useAppContext } from '../../store/context';

import './styles.css';
import { useHistory } from 'react-router-dom';
import Profile from '../Profile/index';

import { userInfoDash } from '../../services/API';

function Main() {
  const { user, isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    if (user.paciente) {
      return <Pacientes />;
    } else {
      return <Empresa />;
    }
  }
}

const Pacientes = () => {
  const history = useHistory();
  const { user } = useAppContext();
  const toggleAgendar = () => history.push('/agendar/');
  const toggleGetAgendamentos = () =>
    history.push({ pathname: '/agendamentos', state: user });

  // completar dados cadastrais apos first login
  if (!user.telefone) {
    return <Profile />;
  }
  return (
    <div className="main">
      <button onClick={toggleAgendar} className="button hover">
        Agendar
      </button>
      <button className="button hover" onClick={toggleGetAgendamentos}>
        Agendamentos
      </button>
    </div>
  );
};

const Empresa = () => {
  const history = useHistory();
  const { user } = useAppContext();
  const [agendadoDia, setAgendadoDia] = useState(0);
  const [agendadoMes, setAgendadoMes] = useState(0);
  const toggleAgendar = () => history.push('/agendar/');

  const fetchDash = async () => {
    try {
      const response = await userInfoDash();

      const totalDia = response.data.message.diaAgendamento.find(
        (res) => res._id.ag === user.nickname
      );
      const totalMes = response.data.message.mesAgendamento.find(
        (res) => res._id.ag === user.nickname
      );
      setAgendadoMes(totalMes.count);
      setAgendadoDia(totalDia.count);
    } catch (error) {}
  };
  fetchDash();
  return (
    <div className="main">
      <button onClick={toggleAgendar} className="button hover">
        Agendar/Consulta
      </button>

      <div className="cardUser">
        <h1>{user.name}</h1>
        {() => new Date()}
        <p>Agendamento Dia : {agendadoDia}</p>
        <p>Total agendado Mes : {agendadoMes}</p>
        <span style={{ fontSize: '10px' }}>
          *Cancelamentos serão abatidos na contabilização
        </span>
      </div>
    </div>
  );
};

export default Main;
