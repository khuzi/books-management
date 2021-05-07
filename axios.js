import axios from "axios";

const instance = axios.create({
  baseURL: "https://young-harbor-60375.herokuapp.com/",
});

export default instance;
