import React, {  } from "react";
import Header from "./Header";


export default function Format({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
