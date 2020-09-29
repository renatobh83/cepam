import React, { useState } from 'react';
import { useAppContext } from '../../store/context';
import Loading from '../../components/Loading';
import './styles.css';
import { useHistory } from 'react-router-dom';

function Main() {
  const { isLoading } = useAppContext;
  const [paciente] = useState(false);

  if (isLoading) {
    return <Loading />;
  }
  if (paciente) {
    return <Pacientes />;
  } else {
    return <Empresa />;
  }
}

const Pacientes = () => {
  const history = useHistory();

  const toggleAgendar = () => history.push('/agendar/');
  return (
    <div className="main">
      <button onClick={toggleAgendar} className="button hover">
        Agendar
      </button>
      <button className="button" className="button hover">
        Agendamentos
      </button>
    </div>
  );
};

const Empresa = () => {
  const history = useHistory();
  const toggleAgendar = () => history.push('/agendar/');
  return (
    <div className="main">
      <button onClick={toggleAgendar} className="button hover">
        Agendar
      </button>
      <div className="cardUser">
        <h1>Nome User</h1>
        <p>Dados Agendamento Dia</p>
        <p>Dados Agendamento Mes</p>
      </div>
    </div>
  );
};

export default Main;
