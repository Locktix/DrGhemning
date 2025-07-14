import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import UserManager from "../components/UserManager";

function AdminPage() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Administration
        </Typography>
        <UserManager />
      </Container>
    </>
  );
}

export default AdminPage; 