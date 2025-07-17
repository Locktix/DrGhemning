import React from "react";
import { Container } from "@mui/material";
import NavBar from "../components/NavBar";
import BloodTestSchedule from "../components/BloodTestSchedule";

function BloodTestSchedulePage() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <BloodTestSchedule />
      </Container>
    </>
  );
}

export default BloodTestSchedulePage; 