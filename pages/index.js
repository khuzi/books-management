import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../axios";

import { Header, CustomizedTables } from "../components";

const Home = () => {
  const router = useRouter();
  const user =
    typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  if (!user) {
    useEffect(() => {
      router.push("/login");
    }, []);
    return null;
  } else {
    const [books, setBooks] = useState([]);
    useEffect(async () => {
      const res = await axios.get("api/books");
      setBooks(res.data);
    }, []);

    return (
      <div style={{ paddingTop: "1rem" }}>
        <Header />
        <div style={{ padding: "1rem 0", textAlign: "center" }}>
          <h1> Total Books = {books?.length}</h1>
        </div>
        <CustomizedTables data={books} />
      </div>
    );
  }
};

export default Home;
