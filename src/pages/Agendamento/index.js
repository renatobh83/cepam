import React, { useState } from "react";

import Loading from "../../components/Loading";
import { useAppContext } from "../../store/context";

import "./styles.css";

import ScreenAgendamento from "../../components/ScreenAgendamento";

function Agendamento() {
  const { isLoading } = useAppContext();
  const [paciente] = useState(true);

  if (isLoading) {
    return <Loading />;
  }
  if (paciente) {
    return <ScreenAgendamento isPaciente={paciente} />;
  } else {
    return <ScreenAgendamento />;
  }
}

export default Agendamento;
