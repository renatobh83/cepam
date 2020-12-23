import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { useAppContext } from '../../store/context';

import './styles.css';

export default function Login() {
  const { loginWithRedirect } = useAppContext();
  return (
    <div className="main">
      <div className="logonContainer">
        <h2>
          Um ambiente acolhedor e especializado nos cuidados com a saúde
          feminina. Uma das grandes vantagens do Centro pesquisas avançados da
          mulher é a facilidade de em um mesmo espaço, poder realizar exames
          como mamografia, densitometria óssea, ultrassonografia e testes
          necessários para o diagnóstico precoce de câncer.
          <p>
            Além disso, a Clínica também  conta com especialistas capacitados
            para tratar da doença que atinge 10% da população feminina. Faca seu
            login e realize o seu agendamento de modo facil 
          </p>
        </h2>
        {/* <FiHeart size={100} color={'white'} /> */}
        <div className="login-btn-group">
          <button onClick={() => loginWithRedirect()} className="button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
