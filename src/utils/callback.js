import React, { useEffect } from 'react';
import { useAppContext } from '../store/context';
import { useHistory } from 'react-router-dom';

import Loading from '../components/Loading';
import { useCallback } from 'react';

export default function Callback() {
  const { user, logout, setIsAuthenticated } = useAppContext();
  const history = useHistory();

  const mongo = useCallback(() => {
    if (!user.ativo) {
      alert('Usuário não esta ativo');
      setIsAuthenticated(false);
      logout();
    } else {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    mongo();
  }, []);
  return (
    <div>
      <Loading />
    </div>
  );
}
