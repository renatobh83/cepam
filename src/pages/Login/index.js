import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { useAppContext } from '../../store/context';

import './styles.css';

export default function Login() {
  const { loginWithRedirect } = useAppContext();
  return (
    <div className="logonContainer">
      <div className="logo">
        <FiHeart size={100} color={'white'} />
      </div>
      <div className="login-btn-group">
        <button onClick={() => loginWithRedirect()} className="button">
          Login
        </button>
      </div>
    </div>
  );
}
