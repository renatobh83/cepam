import React, { useEffect, useCallback } from 'react';
import { useAppContext } from '../store/context';
import { useHistory } from 'react-router-dom';
import Loading from './Loading';

export default function Callback() {
  const { user, logout, setIsAuthenticated } = useAppContext();
  const history = useHistory();

  const mongo = useCallback(async () => {
    if (!user.ativo) {
      alert('Usuário não esta ativo');
      setIsAuthenticated(false);
      logout();
    } else {
      history.push('/');
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    mongo();
  }, []); // eslint-disable-line
  return (
    <div>
      <Loading />
    </div>
  );
}
