import React, { useCallback, useEffect, useState } from 'react';
import ScreenAgendamento from '../../components/ScreenAgendamento';

import './styles.css';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../store/context';
import Loading from '../../components/Loading';
import InputMask from 'react-input-mask';

function Pacientes(props) {
  const { isLoading } = useAppContext();
  const history = useHistory();
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [prosseguir, setProsseguir] = useState(false);
  const [paciente, setPaciente] = useState({});

  const loadDate = useCallback(() => {
    if (props.location.state.pacienteEdit) {
      setName(props.location.state.pacienteEdit.name);
    }
  }, []);
  const handleCancel = () => {
    history.push('/agendar');
  };
  const handleSubmit = () => {
    const data = {
      name,
      username: name,
      email,
      telefone,
      dtNascimento,
      paciente: true,
    };

    setPaciente(data);
    setProsseguir(true);
  };
  useEffect(() => {
    loadDate();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="agendamentoContainer">
      {!prosseguir && (
        <>
          <h1>{name ? 'Editar Paciente' : 'Cadastro de Paciente'}</h1>
          <div className="floating-label-input">
            <input
              type="text"
              id="nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="nome">Nome </label>
            <span className="line"></span>
          </div>
          <div className="floating-label-input">
            <input
              type="text"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">E-mail</label>
            <span className="line"></span>
          </div>
          <div className="groupInputs">
            <div className="floating-label-input">
              <InputMask
                mask="(99)99999-9999"
                type="text"
                id="dtNascimento"
                inputMode="numeric"
                required
                value={dtNascimento}
                onChange={(e) => setDtNascimento(e.target.value)}
              />
              <label htmlFor="dtNascimento">Data Nascimento </label>
              <span className="line"></span>
            </div>
            <div className="floating-label-input">
              <InputMask
                mask="(99)99999-9999"
                type="text"
                id="telefone"
                inputMode="numeric"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <label htmlFor="telefone">Telefone</label>
              <span className="line"></span>
            </div>
          </div>
          <div className="groupInputs">
            <button className="button " onClick={handleSubmit}>
              Gravar
            </button>
            <button className="button button-danger" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </>
      )}
      {prosseguir && (
        <ScreenAgendamento isPaciente={'pasda'} pacienteFromForm={paciente} />
      )}
    </div>
  );
}

export default Pacientes;
