import React from "react";
import { Container, Typography, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import VaccinManager from "../components/VaccinManager";

function VaccinsPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
      py: { xs: 2, md: 6 },
    }}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary.main">
          Gestionnaire de vaccins
        </Typography>
        <VaccinManager />
      </Container>
    </Box>
  );
}

export default VaccinsPage; 