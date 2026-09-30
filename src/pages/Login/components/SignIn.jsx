import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../firebase-config";
import useAsyncAction from "../../../hooks/useAsyncAction";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();
const auth = getAuth(app);

export default function SignIn() {
  const navigate = useNavigate(); //取得 navigate
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const emailInputRef = React.useRef(null);
  const { run, pending: isSubmitting, error: loginError } = useAsyncAction("登入失敗，請確認帳號與密碼後再試一次。");
  const handleSubmit = (event) => {
    event.preventDefault();
    run(async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/", { replace: true });
      } catch (error) {
        setEmail("");
        setPassword("");
        // Focus after the pending state has re-enabled the input.
        throw error;
      }
    });
  };
  React.useEffect(() => {
    if (!isSubmitting && loginError) emailInputRef.current?.focus();
  }, [isSubmitting, loginError]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              inputRef={emailInputRef}
              disabled={isSubmitting}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {loginError && (
              <Typography role="alert" color="error" variant="body2" sx={{ mt: 1 }}>
                {loginError}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

