import React, { useState } from "react";
import Router from "next/router";
import { useMutation } from "react-query";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";

import { onLogin } from "../utils/functions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alertBox: {
    paddingTop: "2rem",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn() {
  const classes = useStyles();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation(async (cred) => {
    const res = await onLogin(cred);
    localStorage.setItem("token", res.headers["x-auth-token"]);
    localStorage.setItem("user", JSON.stringify(res.data));
    Router.push("/");
  });

  const onSubmitLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(state);
  };

  const user =
    typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  if (user) {
    Router.push("/");
    return null;
  }

  return (
    <div className={classes.alertBox}>
      {loginMutation.isLoading ? (
        <Alert severity="warning">Authenticating</Alert>
      ) : (
        <>
          {loginMutation.isError ? (
            <Alert severity="error">Authentication Failed</Alert>
          ) : null}
          {loginMutation.isSuccess ? (
            <Alert severity="success">Login Successful</Alert>
          ) : null}
        </>
      )}
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmitLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              required
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              required
              autoComplete="current-password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
