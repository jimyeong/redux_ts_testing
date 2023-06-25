import React, { useState } from "react";
import MainPage from "./pages/Main/MainPage";
import "fomantic-ui-css/semantic.css";
import { Routes, Route } from "react-router-dom";

import { Container, Header, Loader } from "semantic-ui-react";

function App() {
  return (
    <>
      <Container>
        <Routes>
          <Route element={<MainPage />} path="/" />

          <Route element={<div>Page not found</div>} path="/*" />
        </Routes>
      </Container>
    </>
  );
}

export default App;
