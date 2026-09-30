import * as React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase-config";
import { initializeUser, loadDashboardData, subscribeDataScope, getDataScope } from "./model/firebase";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const EditOrder = React.lazy(() => import("./pages/EditOrder"));
const SummaryList = React.lazy(() => import("./pages/SummaryList"));
const InvoiceList = React.lazy(() => import("./pages/InvoiceList"));
const Query = React.lazy(() => import("./pages/Query"));
const SettingMenu = React.lazy(() => import("./pages/SettingMenu"));
const EditMenu = React.lazy(() => import("./pages/EditMenu"));
const YearSettings = React.lazy(() => import("./pages/YearSettings"));
const EditOptions = React.lazy(() => import("./pages/EditOptions"));

function Loading() {
  return <Box sx={{ p: 4 }}><CircularProgress aria-label="載入中" /></Box>;
}

function DataGate() {
  const location = useLocation();
  const scope = React.useSyncExternalStore(subscribeDataScope, getDataScope);
  const [readyScope, setReadyScope] = React.useState(null);
  const loaded = React.useRef(null);
  const [error, setError] = React.useState(false);
  const [attempt, retry] = React.useReducer((value) => value + 1, 0);
  React.useEffect(() => {
    if (loaded.current === scope && location.pathname !== "/") return;
    let active = true;
    setReadyScope(null);
    setError(false);
    loadDashboardData().then(
      () => { if (active) { loaded.current = getDataScope(); setReadyScope(getDataScope()); } },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, [attempt, location.key, location.pathname, scope]);
  if (error) return <Alert severity="error" action={<Button onClick={retry}>重試</Button>}>資料載入失敗，請稍後再試。</Alert>;
  return readyScope === scope ? <Outlet key={scope} /> : <Loading />;
}

export default function App() {
  const [authState, setAuthState] = React.useState({ ready: false, user: null });
  React.useEffect(() => onAuthStateChanged(getAuth(app), (user) => {
    initializeUser(user);
    setAuthState({ ready: true, user });
  }), []);
  if (!authState.ready) return <Loading />;
  return (
    <HashRouter>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="login" element={authState.user ? <Navigate to="/" replace /> : <Login />} />
          <Route element={authState.user ? <DataGate key={authState.user.uid} /> : <Navigate to="/login" replace />}>
            <Route index element={<Home />} />
            <Route path="edit" element={<EditOrder />} />
            <Route path="summary" element={<SummaryList />} />
            <Route path="list" element={<InvoiceList />} />
            <Route path="query" element={<Query />} />
            <Route path="setting" element={<SettingMenu />} />
            <Route path="setting/menu" element={<EditMenu />} />
            <Route path="setting/years" element={<YearSettings />} />
            <Route path="setting/options" element={<EditOptions />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
