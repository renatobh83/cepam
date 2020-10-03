import React, { useEffect } from 'react';
import { useAppContext } from '../store/context';
import { useHistory } from 'react-router-dom';

import Loading from '../components/Loading';
import { useCallback } from 'react';

export default function Callback() {
  const { isLoading, user, token, logout } = useAppContext();
  const history = useHistory();

  const mongo = useCallback(() => {
    if (!user.data.message.ativo) {
      alert('Voce esta inativo');
      logout();
    }
    history.push('/');
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
