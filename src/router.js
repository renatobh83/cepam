import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loading from './components/Loading';

import Login from './pages/Login/';
import { useAppContext } from './store/context';
import Main from './pages/Main/index';
import Header from './pages/Header';
import Agendamento from './pages/Agendamento';

function Router() {
  const { isLoading, isAuthenticated } = useAppContext();

  const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
      {...rest}
      render={(props) => (auth === true ? <Component {...props} /> : <Login />)}
    />
  );
  if (isLoading) {
    return <Loading />;
  }

  const RouteWithNav = () => {
    return (
      <>
        <Header />
        <Route path="/" exact component={Main} />
        <Route path="/agendar" exact component={Agendamento} />
      </>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute auth={isAuthenticated} component={RouteWithNav} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
