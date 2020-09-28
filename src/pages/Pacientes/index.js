import React, { useState } from "react";
import ScreenAgendamento from "../../components/ScreenAgendamento";

import "./styles.css";

function Pacientes(props) {
  console.log(props.location.state);
  const [a, setA] = useState(false);
  return (
    <div className="agendamentoContainer">
      Cadastro paciente
      <button onClick={() => setA(true)}>Agendar</button>
      {a && (
        <ScreenAgendamento isPaciente={"pasda"} pacienteFromForm={"Renato"} />
      )}
    </div>
  );
}

export default Pacientes;
