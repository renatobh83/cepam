import React from 'react';
import { useAppContext } from '../store/context';
import { useHistory } from 'react-router-dom';

export default function Callback() {
  const { isLoading, user, token } = useAppContext();
  const history = useHistory();
  if (isLoading) {
    return <div> Loading</div>;
  } else {
    token().then((res) => console.log(res));

    history.push('/');
  }
  return <div></div>;
}
