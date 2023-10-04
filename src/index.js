import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { Provider } from "react-redux";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
let persistor= persistStore(store)
root.render(
  <React.StrictMode>

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>

      </PersistGate>
    </Provider>

  </React.StrictMode>
);

