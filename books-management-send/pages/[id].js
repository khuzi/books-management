import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "../axios";

import { updateBook } from "../utils/functions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "2rem",
  },
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Update() {
  const classes = useStyles();
  const router = useRouter();

  const user =
    typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  if (!user) {
    useEffect(() => {
      router.push("/login");
    }, []);
    return null;
  } else {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const { id } = router.query;

    useEffect(async () => {
      const res = await axios.get(`api/books/${id}`);
      const { data } = res;
      setTitle(data.title);
      setAuthor(data.author.name);
      setPublishedYear(data.publishedYear);
    }, []);

    const mutation = useMutation(async (book) => {
      await updateBook(token, book, id);
    });

    const onUpdateClick = (e) => {
      e.preventDefault();
      mutation.mutate({
        title,
        author,
        publishedYear,
      });
    };

    useEffect(() => {
      if (mutation.isSuccess) {
        const timer = setTimeout(() => {
          router.push("/");
        }, 2000);
        return () => {
          clearTimeout(timer);
        };
      }
    }, [mutation]);

    return (
      <div className={classes.root}>
        {mutation.isLoading ? (
          <Alert severity="warning">Updating Book</Alert>
        ) : (
          <>
            {mutation.isError ? (
              <Alert severity="error">Updating Failed</Alert>
            ) : null}
            {mutation.isSuccess ? (
              <Alert severity="success">Book Updated</Alert>
            ) : null}
          </>
        )}

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Update Book
            </Typography>
            <form className={classes.form} onSubmit={onUpdateClick}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="title"
                    variant="outlined"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="publishedYaer"
                    label="Published Year"
                    name="publishedYear"
                    value={publishedYear}
                    onChange={(e) => setPublishedYear(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="Author"
                    label="Author"
                    name="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update Book
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}
