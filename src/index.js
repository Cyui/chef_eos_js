import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EditOrder from "./pages/EditOrder";
import SummaryList from "./pages/SummaryList";
import InvoiceList from "./pages/InvoiceList";
import Query from "./pages/Query";
import SettingMenu from "./pages/SettingMenu";
import EditMenu from "./pages/EditMenu";
import EditOptions from "./pages/EditOptions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const root = ReactDOM.createRoot(document.getElementById("root"));

onAuthStateChanged(auth, (user) => {
  root.render(
    <React.StrictMode>
      {/* <App /> */}
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="" element={user ? <Home /> : <Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="edit" element={user ? <EditOrder /> : <Navigate to="../login" />} />
          <Route path="summary" element={user ? <SummaryList /> : <Navigate to="../login" />} />
          <Route path="list" element={user ? <InvoiceList /> : <Navigate to="../login" />} />
          <Route path="query" element={user ? <Query /> : <Navigate to="../login" />} />
          <Route path="setting" element={user ? <SettingMenu /> : <Navigate to="../login" />} />
          <Route path="setting/menu" element={user ? <EditMenu /> : <Navigate to="../login" />} />
          <Route path="setting/options" element={user ? <EditOptions /> : <Navigate to="../login" />}
          />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
