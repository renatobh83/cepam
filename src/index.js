import React from "react";
import ReactDOM from "react-dom";
import "./global.css";
import App from "./App";
import AppContext from "./store/context";
import "bootstrap/dist/css/bootstrap.min.css";
ReactDOM.render(
  <AppContext
    domain={process.env.REACT_APP_DOMAIN}
    client_id={process.env.REACT_APP_CLIENT_ID}
    redirect_uri={process.env.REACT_APP_CALLBACK}
    // redirect_uri={window.location.origin}
    // cacheLocation="localstorage"
    // useRefreshTokens="true"
  >
    <App />
  </AppContext>,
  document.getElementById("root")
);
