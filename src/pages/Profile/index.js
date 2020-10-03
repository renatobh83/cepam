import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { useAppContext } from '../../store/context';
import './styles.css';

export default function Profile() {
  const { user } = useAppContext();
  if (user.paciente) {
    return <Paciente user={user} />;
  } else {
    return <Empresa />;
  }
}

const Paciente = ({ user }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: nome,
      email,
      telefone,
      dtNascimento,
    };
    // await updateEmail(email, data).then((res) => window.location.reload());
  };
  const handleProfile = useCallback(() => {
    setNome(user.name);
    setEmail(user.email);
    setDtNascimento(user.dtNascimento);
    setTelefone(user.telefone);
  }, []); // eslint-disable-line
  useEffect(() => {
    handleProfile();
  }, [handleProfile]);
  return (
    <div className="profilePaciente">
      <form onSubmit={handleSubmit}>
        <div className="floating-label-input">
          <input
            type="text"
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
          <label htmlFor="email">E-mail </label>
          <span className="line"></span>
        </div>
        <div className="groupFlex">
          <div className="floating-label-input">
            <InputMask
              mask="(99)99999-9999"
              id="telefone"
              required
              inputMode="numeric"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <label htmlFor="telefone">Telefone </label>
            <span className="line"></span>
          </div>
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
            <label htmlFor="dtNascimento" className="lbDtNasc">
              Data Nascimento
            </label>
            <span className="line"></span>
          </div>
        </div>

        <div className="inputProfileButtons">
          <button>Gravar</button>
        </div>
      </form>
    </div>
  );
};
const Empresa = () => {
  const [nome, setNome] = useState('');
  const [password, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: nome,
      password,
      telefone,
      email,
    };

    // await updateEmail(email, data).then(() => {
    //   alert('Proximo login dados serão atualizados');
    //   history.push('/');
    // });
  };

  const handleProfile = useCallback(() => {
    // setNome(state.responseAPI.message.name);
    // setEmail(state.responseAPI.message.email);
    // setTelefone(state.responseAPI.message.telefone);
  }, []); // eslint-disable-line
  useEffect(() => {
    handleProfile();
  }, []); // eslint-disable-line
  return (
    <div className="profilePaciente">
      <form onSubmit={handleSubmit}>
        <div className="floating-label-input">
          <input
            type="text"
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <label htmlFor="nome">Nome </label>
          <span className="line"></span>
        </div>

        <div className="floating-label-input">
          <input
            type="password"
            id="senha"
            required
            value={password}
            onChange={(e) => setSenha(e.target.value)}
          />
          <label htmlFor="senha">Senha </label>
          <span className="line"></span>
        </div>

        <div className="floating-label-input">
          <InputMask
            mask="(99)99999-9999"
            id="telefone"
            inputMode="numeric"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <label htmlFor="telefone">Telefone </label>
          <span className="line"></span>
        </div>
        <div className="inputProfileButtons">
          <button>Gravar</button>
        </div>
      </form>
    </div>
  );
};
