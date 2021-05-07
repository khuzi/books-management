import axios from "../axios";

export const onLogin = (cred) => {
  return axios.post("api/auth", cred, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addNewBook = (token, book) => {
  return axios.post("api/books", book, {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  });
};

export const updateBook = (token, book, id) => {
  return axios.put(`api/books/${id}`, book, {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  });
};

export const deleteBook = (token, id) => {
  return axios.delete(`api/books/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  });
};
