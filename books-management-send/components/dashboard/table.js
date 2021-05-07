import React from "react";
import { useMutation } from "react-query";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import { deleteBook } from "../../utils/functions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 1000,
    marginTop: "1rem",
  },
});

export function CustomizedTables({ data }) {
  const classes = useStyles();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const mutation = useMutation(async (id) => {
    await deleteBook(token, id);
  });

  const onDeleteClick = (e, id) => {
    e.preventDefault();
    mutation.mutate(id);
  };

  return (
    <TableContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {mutation.isLoading ? (
          <Alert severity="error">Deleteing Book</Alert>
        ) : (
          <>
            {mutation.isError ? (
              <Alert severity="error">Deleting Failed</Alert>
            ) : null}
            {mutation.isSuccess ? (
              <Alert severity="success">Deleted</Alert>
            ) : null}
          </>
        )}
        <Link href="/add">
          <a
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Add New Book
            <span>
              <AddIcon />
            </span>
          </a>
        </Link>
      </div>

      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Author</StyledTableCell>
            <StyledTableCell align="center">Published Year</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((book) => (
            <StyledTableRow key={book.id}>
              <StyledTableCell component="th" scope="row">
                {book.id}
              </StyledTableCell>
              <StyledTableCell align="center">{book.title}</StyledTableCell>
              <StyledTableCell align="center">
                {book.author.name}
              </StyledTableCell>
              <StyledTableCell align="center" width="180px">
                {book.publishedYear}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Grid container justify="space-around">
                  <Link href={`/${book.id}`}>
                    <EditIcon />
                  </Link>
                  <div onClick={(e) => onDeleteClick(e, book.id)}>
                    <DeleteIcon />
                  </div>
                </Grid>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
