import React, { useEffect, useCallback } from 'react';
import { useAppContext } from '../store/context';
import { useHistory } from 'react-router-dom';

import Loading from '../components/Loading';

export default function Callback() {
  const { user, logout, setIsAuthenticated } = useAppContext();
  const history = useHistory();

  const mongo = useCallback(() => {
    if (!user.ativo) {
      alert('Usuário não esta ativo');
      setIsAuthenticated(false);
      logout();
    } else {
    }
  }, []);

  useEffect(() => {
    history.push('/');
  }, []);
  return (
    <div>
      <Loading />
    </div>
  );
}
