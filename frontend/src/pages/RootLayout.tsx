import React from "react";
import { Outlet } from "react-router-dom";
import TextEditor from "../components/TextEditor";

function RootLayout() {
  return (
    <>
      <TextEditor />
    </>
  );
}

export default RootLayout;
