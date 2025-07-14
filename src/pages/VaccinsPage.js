import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import VaccinManager from "../components/VaccinManager";

function VaccinsPage() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gestionnaire de vaccins
        </Typography>
        <VaccinManager />
      </Container>
    </>
  );
}

export default VaccinsPage; 