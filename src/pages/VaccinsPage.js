import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import VaccinManager from "../components/VaccinManager";

function VaccinsPage() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <VaccinManager />
      </Container>
    </>
  );
}

export default VaccinsPage; 