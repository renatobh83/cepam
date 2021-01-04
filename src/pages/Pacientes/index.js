import React, { useCallback, useEffect, useState } from 'react';
import ScreenAgendamento from '../../components/ScreenAgendamento';

import './styles.css';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../store/context';
import Loading from '../../components/Loading';
import InputMask from 'react-input-mask';
import { postPaciente, putUser } from '../../services/API';

function Pacientes(props) {
  const { isLoading } = useAppContext();
  const [isPaciente, setIspaciente] = useState(null);
  const history = useHistory();
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [prosseguir, setProsseguir] = useState(false);

  const [userAuth, setUserAuth] = useState(true);
  const loadDate = useCallback(() => {
    if (props.location.state.pacienteEdit) {
      setIspaciente(props.location.state.pacienteEdit);
      const {
        name,
        email,
        dtNascimento,
        telefone,
      } = props.location.state.pacienteEdit;

      if (props.location.state.pacienteEdit.sub) {
        const auth = props.location.state.pacienteEdit.sub.split('|')[0];
        if (auth !== 'auth0') setUserAuth(false);
      } else {
      }

      setName(name);
      setEmail(email);
      setDtNascimento(dtNascimento);
      setTelefone(telefone);
    }
  }, []); // eslint-disable-line
  const handleCancel = () => {
    history.push('/agendar');
  };
  const handleSubmit = async () => {
    const data = {
      name,
      nickname: name,
      email,
      telefone,
      dtNascimento,
      paciente: true,
    };

    if (props.location.state.pacienteEdit) {
      const data = { name, email, telefone, dtNascimento };
      await putUser(props.location.state.pacienteEdit.email, data);
      setProsseguir(true);
    } else {
       const paciente = await postPaciente(data);
     console.log(data) 
      if (paciente.data.statusCode !== 400) {
        setIspaciente(paciente.data.message);
        setProsseguir(true);
      } else {
        alert('Email já cadastrado');
      }
    }
  };
  useEffect(() => {
    loadDate();
  }, []); // eslint-disable-line
  if (isLoading) {
    return <Loading />;
  }
  return (  
    <div className="agendamentoContainer">
      {!prosseguir && (
        <>
          <h1>{name ? 'Editar Paciente' : 'Cadastro de Paciente'}</h1>
        <form style={{width:"100%"}}>
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
          {userAuth ? (
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
          ) : (
            <div className="floating-label-input">
              <input type="text" id="email" required value={email} disabled />
            </div>
          )}
          <div className="groupInputs">
            <div className="floating-label-input">
              <InputMask
                mask="99/99/9999"
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
</form>
          
                 </>
      )}
      {prosseguir && <ScreenAgendamento isPaciente={isPaciente} />}
    </div>
   
  );
}

export default Pacientes;
