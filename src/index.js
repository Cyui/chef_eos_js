import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate} from "react-router-dom";
import './index.css';
import Home from './pages/Home'
import EditOrder from './pages/EditOrder'
import SummaryList from './pages/SummaryList'
import InvoiceList from './pages/InvoiceList'
import Query from './pages/Query'
import { Login } from "./pages/Login";
import { getAuth, onAuthStateChanged} from "firebase/auth";

const auth = getAuth();
const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, (user) => {
  root.render(
    <React.StrictMode>
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="" element={user ? <Home /> : <Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="edit" element={user ? <EditOrder /> : <Navigate to="../login" />} />
          <Route path="summary" element={user ? <SummaryList /> : <Navigate to="../login" />} />
          <Route path="list" element={user ? <InvoiceList /> : <Navigate to="../login" />} />
          <Route path="query" element={user ? <Query /> : <Navigate to="../login" />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
});