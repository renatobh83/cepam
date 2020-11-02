import React from 'react';

import Loading from '../../components/Loading';
import { useAppContext } from '../../store/context';

import './styles.css';

import ScreenAgendamento from '../../components/ScreenAgendamento';

function Agendamento() {
  const { isLoading, user } = useAppContext();

  if (isLoading) {
    return <Loading />;
  }

  if (user.paciente) {
    return <ScreenAgendamento isPaciente={user} />;
  } else {
    return <ScreenAgendamento />;
  }
}

export default Agendamento;
